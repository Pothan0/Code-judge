const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

class CompilerService {
  constructor() {
    // Create temporary directory for code execution
    this.tempDir = path.join(__dirname, '..', 'temp');
    fs.ensureDirSync(this.tempDir);
  }

  async executeCode(code, language, input = '', timeLimit = 2000, memoryLimit = 128) {
    const submissionId = uuidv4();
    const workDir = path.join(this.tempDir, submissionId);
    
    try {
      // Create working directory
      await fs.ensureDir(workDir);

      let result;
      switch (language) {
        case 'cpp':
          result = await this.executeCpp(code, input, workDir, timeLimit);
          break;
        case 'java':
          result = await this.executeJava(code, input, workDir, timeLimit);
          break;
        case 'python':
          result = await this.executePython(code, input, workDir, timeLimit);
          break;
        default:
          throw new Error('Unsupported language');
      }

      return result;
    } catch (error) {
      return {
        status: 'Runtime Error',
        output: '',
        error: error.message,
        executionTime: 0,
        memoryUsed: 0
      };
    } finally {
      // Clean up temporary files
      try {
        await fs.remove(workDir);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
  }

  async executeCpp(code, input, workDir, timeLimit) {
    const sourceFile = path.join(workDir, 'main.cpp');
    const executableFile = path.join(workDir, 'main.exe');
    
    // Write source code to file
    await fs.writeFile(sourceFile, code);

    // Compile C++ code
    const compileResult = await this.runProcess('g++', [
      sourceFile, 
      '-o', 
      executableFile,
      '-std=c++17',
      '-O2'
    ], workDir, 10000); // 10 second compile timeout

    if (compileResult.exitCode !== 0) {
      return {
        status: 'Compilation Error',
        output: '',
        error: compileResult.stderr,
        executionTime: 0,
        memoryUsed: 0
      };
    }

    // Execute compiled program
    const executeResult = await this.runProcess(executableFile, [], workDir, timeLimit, input);
    
    return {
      status: executeResult.exitCode === 0 ? 'Success' : 'Runtime Error',
      output: executeResult.stdout,
      error: executeResult.stderr,
      executionTime: executeResult.executionTime,
      memoryUsed: executeResult.memoryUsed || 0
    };
  }

  async executeJava(code, input, workDir, timeLimit) {
    // Extract class name from code
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Main';
    
    const sourceFile = path.join(workDir, `${className}.java`);
    
    // Write source code to file
    await fs.writeFile(sourceFile, code);

    // Compile Java code
    const compileResult = await this.runProcess('javac', [sourceFile], workDir, 10000);

    if (compileResult.exitCode !== 0) {
      return {
        status: 'Compilation Error',
        output: '',
        error: compileResult.stderr,
        executionTime: 0,
        memoryUsed: 0
      };
    }

    // Execute Java program
    const executeResult = await this.runProcess('java', [
      '-cp', workDir,
      className
    ], workDir, timeLimit, input);
    
    return {
      status: executeResult.exitCode === 0 ? 'Success' : 'Runtime Error',
      output: executeResult.stdout,
      error: executeResult.stderr,
      executionTime: executeResult.executionTime,
      memoryUsed: executeResult.memoryUsed || 0
    };
  }

  async executePython(code, input, workDir, timeLimit) {
    const sourceFile = path.join(workDir, 'main.py');
    
    // Write source code to file
    await fs.writeFile(sourceFile, code);

    // Execute Python code - use full path to source file
    console.log(`Executing Python code in: ${workDir}`);
    console.log(`Python file: ${sourceFile}`);
    
    const executeResult = await this.runProcess('python', [sourceFile], workDir, timeLimit, input);
    
    return {
      status: executeResult.exitCode === 0 ? 'Success' : 'Runtime Error',
      output: executeResult.stdout,
      error: executeResult.stderr,
      executionTime: executeResult.executionTime,
      memoryUsed: executeResult.memoryUsed || 0
    };
  }

  runProcess(command, args, cwd, timeout, input = '') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      // Log the command being executed for debugging
      console.log(`Executing command: ${command} ${args.join(' ')}`);
      console.log(`Working directory: ${cwd}`);
      console.log(`Input: "${input}"`);
      
      // On Windows, properly handle paths with spaces
      let processArgs = args;
      if (process.platform === 'win32') {
        processArgs = args.map(arg => {
          // Quote arguments that contain spaces or special characters
          if (typeof arg === 'string' && (arg.includes(' ') || arg.includes('\\'))) {
            return `"${arg}"`;
          }
          return arg;
        });
      }
      
      const child = spawn(command, processArgs, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true, // Always use shell to handle paths with spaces properly
        windowsHide: true // Hide command window on Windows
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Set timeout
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: 'Time Limit Exceeded',
          executionTime: timeout,
          memoryUsed: 0
        });
      }, timeout);

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        const executionTime = Date.now() - startTime;
        
        resolve({
          exitCode,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          executionTime,
          memoryUsed: 0 // Would need platform-specific code to measure actual memory usage
        });
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        console.error(`Process error for command: ${command} ${args.join(' ')}`);
        console.error(`Working directory: ${cwd}`);
        console.error(`Error: ${error.message}`);
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: `Process spawn error: ${error.message}`,
          executionTime: Date.now() - startTime,
          memoryUsed: 0
        });
      });

      // Send input to process
      if (input) {
        child.stdin.write(input);
        // Add newline if input doesn't end with one
        if (!input.endsWith('\n')) {
          child.stdin.write('\n');
        }
      }
      child.stdin.end();
    });
  }

  async runTestCases(code, language, testCases, timeLimit, memoryLimit) {
    let passedCount = 0;
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = await this.executeCode(code, language, testCase.input, timeLimit, memoryLimit);
      
      const passed = result.status === 'Success' && 
                    result.output.trim() === testCase.expectedOutput.trim();
      
      if (passed) {
        passedCount++;
      }

      results.push({
        testCaseIndex: i,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        status: result.status,
        error: result.error,
        executionTime: result.executionTime
      });

      // Stop on first failure for optimization (optional)
      if (!passed && result.status !== 'Success') {
        break;
      }
    }

    return {
      passedCount,
      totalCount: testCases.length,
      results
    };
  }
}

module.exports = CompilerService;
