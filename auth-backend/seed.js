const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
    difficulty: "Easy",
    tags: ["array", "hash-table"],
    timeLimit: 2000,
    memoryLimit: 128,
    constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
    inputFormat: "First line contains n (length of array) and target.\nSecond line contains n integers representing the array.",
    outputFormat: "Two integers representing the indices of the two numbers.",
    sampleInput: "4 9\n2 7 11 15",
    sampleOutput: "0 1",
    testCases: [
      {
        input: "4 9\n2 7 11 15",
        expectedOutput: "0 1"
      },
      {
        input: "3 6\n3 2 4",
        expectedOutput: "1 2"
      },
      {
        input: "2 6\n3 3",
        expectedOutput: "0 1"
      },
      {
        input: "5 8\n1 2 3 4 5",
        expectedOutput: "2 4"
      }
    ]
  },
  {
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Example 1:
Input: x = 123
Output: 321

Example 2:
Input: x = -123
Output: -321

Example 3:
Input: x = 120
Output: 21`,
    difficulty: "Medium",
    tags: ["math"],
    timeLimit: 1000,
    memoryLimit: 64,
    constraints: `-2^31 <= x <= 2^31 - 1`,
    inputFormat: "A single integer x.",
    outputFormat: "The reversed integer, or 0 if it overflows.",
    sampleInput: "123",
    sampleOutput: "321",
    testCases: [
      {
        input: "123",
        expectedOutput: "321"
      },
      {
        input: "-123",
        expectedOutput: "-321"
      },
      {
        input: "120",
        expectedOutput: "21"
      },
      {
        input: "0",
        expectedOutput: "0"
      },
      {
        input: "1534236469",
        expectedOutput: "0"
      }
    ]
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
    difficulty: "Easy",
    tags: ["string", "stack"],
    timeLimit: 1000,
    memoryLimit: 64,
    constraints: `1 <= s.length <= 10^4
s consists of parentheses only '()[]{}'.`,
    inputFormat: "A string s containing parentheses.",
    outputFormat: "true if the string is valid, false otherwise.",
    sampleInput: "()",
    sampleOutput: "true",
    testCases: [
      {
        input: "()",
        expectedOutput: "true"
      },
      {
        input: "()[]{}", 
        expectedOutput: "true"
      },
      {
        input: "(]",
        expectedOutput: "false"
      },
      {
        input: "([)]",
        expectedOutput: "false"
      },
      {
        input: "{[]}",
        expectedOutput: "true"
      }
    ]
  },
  {
    title: "Longest Common Subsequence",
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

For example, "ace" is a subsequence of "abcde".

A common subsequence of two strings is a subsequence that is common to both strings.

Example 1:
Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:
Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.

Example 3:
Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no such common subsequence, so the result is 0.`,
    difficulty: "Hard",
    tags: ["dynamic-programming", "string"],
    timeLimit: 3000,
    memoryLimit: 256,
    constraints: `1 <= text1.length, text2.length <= 1000
text1 and text2 consist of only lowercase English characters.`,
    inputFormat: "Two strings text1 and text2 on separate lines.",
    outputFormat: "An integer representing the length of the longest common subsequence.",
    sampleInput: "abcde\nace",
    sampleOutput: "3",
    testCases: [
      {
        input: "abcde\nace",
        expectedOutput: "3"
      },
      {
        input: "abc\nabc",
        expectedOutput: "3"
      },
      {
        input: "abc\ndef",
        expectedOutput: "0"
      },
      {
        input: "bl\nyby",
        expectedOutput: "1"
      }
    ]
  },
  {
    title: "Fibonacci Number",
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1.

Given n, calculate F(n).

Example 1:
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.

Example 2:
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.

Example 3:
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.`,
    difficulty: "Easy",
    tags: ["math", "dynamic-programming", "recursion"],
    timeLimit: 1000,
    memoryLimit: 64,
    constraints: `0 <= n <= 30`,
    inputFormat: "A single integer n.",
    outputFormat: "The nth Fibonacci number.",
    sampleInput: "2",
    sampleOutput: "1",
    testCases: [
      {
        input: "2",
        expectedOutput: "1"
      },
      {
        input: "3",
        expectedOutput: "2"
      },
      {
        input: "4",
        expectedOutput: "3"
      },
      {
        input: "0",
        expectedOutput: "0"
      },
      {
        input: "1",
        expectedOutput: "1"
      },
      {
        input: "10",
        expectedOutput: "55"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Create admin user
    console.log('Creating admin user...');
    const adminExists = await User.findOne({ email: 'admin@onlinejudge.com' });
    
    let adminUser;
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      adminUser = await User.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@onlinejudge.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Admin user created successfully');
    } else {
      adminUser = adminExists;
      console.log('Admin user already exists');
    }

    // Clear existing problems
    console.log('Clearing existing problems...');
    await Problem.deleteMany({});

    // Create sample problems
    console.log('Creating sample problems...');
    const problems = await Promise.all(
      sampleProblems.map(problem => 
        Problem.create({
          ...problem,
          createdBy: adminUser._id
        })
      )
    );

    console.log(`Successfully created ${problems.length} sample problems:`);
    problems.forEach(problem => {
      console.log(`- ${problem.title} (${problem.difficulty})`);
    });

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@onlinejudge.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
