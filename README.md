# GAS-Terminal
A spreadsheet that can easily execute functions (called *commands*) created with Google Apps Script. It also supports **long-running** scripts.

The original spreadsheet is [here](https://docs.google.com/spreadsheets/d/1Xh0-dhsBwWjOrEbtoctB91ffzWyM3MuaiCaNloEuvrY).

Related article is [here](https://inclucat.wordpress.com/2021/07/07/gas-terminal-environment-for-smart-execution-of-google-apps-script/).
(Now, I am working on an additional article about support for long-running scripts! )

![image](https://user-images.githubusercontent.com/82203087/124220302-a0f51580-db38-11eb-9d61-05f337308221.png)


## What is this?
This spreadsheet will help you in the following ways.
* it makes your functions manageable and easy to understand.
* it allows you to modify execution parameters and to run the functions easily.
* it allows you to check the execution result log easily.

## How to use
### 1. Copy the original spreadsheet (only once).
Open [this spreadsheat](https://docs.google.com/spreadsheets/d/1Xh0-dhsBwWjOrEbtoctB91ffzWyM3MuaiCaNloEuvrY), click [File]-[Make a copy], and save it to your Google Drive with a name of your choice. (You must be signed in with a Google account.)

![image](https://user-images.githubusercontent.com/82203087/124213256-38ec0280-db2b-11eb-8733-f60eb0cf9676.png)

### 2. Open the Script editor
Open the new spreadsheet, click [Tools]-[Script editor].

![image](https://user-images.githubusercontent.com/82203087/124213405-73559f80-db2b-11eb-8390-e8d13fa9c55d.png)

### 3. Write your code.
In the Script editor, you can write any function you need. You can write it in any source file you like (or in a new file, of course), but do not edit the group of files starting with `gas-terminal`.

![image](https://user-images.githubusercontent.com/82203087/124213916-5c637d00-db2c-11eb-9777-7780bd712df4.png)

**Tips**
* To output the log to the result area, use the LogUtils class.
* A function can have up to five arguments. (All parameters are of type string)

### 4. Write the definition of the command
In the Commands sheet, write the command definition that corresponds to the function you wrote.

![image](https://user-images.githubusercontent.com/82203087/124215369-d432a700-db2e-11eb-9436-a0558047323a.png)

### 5. Execute the command
In the Terminal sheet, select the command, input parameters, then click the Execute button.

![image](https://user-images.githubusercontent.com/82203087/124215772-adc13b80-db2f-11eb-8e8b-5b8349e53cbb.png)


### 6. Authorize the script to run (only once)
The first time you run it, you will see a dialog asking for permission to run the script. Follow the steps below to allow the script to run.
* Click `Continue`
![image](https://user-images.githubusercontent.com/82203087/124216139-7901b400-db30-11eb-8779-64ee5d08b5e5.png)

* Select your account (Perhaps it will be a different procedure for signing in.)
![image](https://user-images.githubusercontent.com/82203087/124216263-ced65c00-db30-11eb-9ca8-b76ed62b9d9a.png)

* Click `Advanced`.
![image](https://user-images.githubusercontent.com/82203087/124218572-72297000-db35-11eb-8415-7fea148d679a.png)

* Click `Go to GAS-Terminal (unsafe)`.
![image](https://user-images.githubusercontent.com/82203087/124218687-b4eb4800-db35-11eb-8e64-64ffe67d2911.png)

* Click `Allow`.
![image](https://user-images.githubusercontent.com/82203087/124218833-fe3b9780-db35-11eb-8aa7-21949c756da3.png)

* Then click Execute button again.

  **Don't worry about the word "unsafe". It's a dialog that all of us face when running our personal scripts.👍**


### 7. Click `Yes` and check the result (as shown at the top of this page).
![image](https://user-images.githubusercontent.com/82203087/124218975-4c509b00-db36-11eb-9e84-7b4b5f6e425e.png)


## If you want to modify this tool by using clasp and TypeScript
1. Follow the instructions above to copy the original spreadsheet. 
2. Open the Script editor, click `Project Settings`, copy the `Script ID`. (We'll use it later)
3. If you have not installed `clasp` yet, install `clasp`, following [the official page](https://github.com/google/clasp).
4. Do the command `clasp login`, and login with your account. (If you have not done yet)
5. Clone this repository, and open the cloned project with your IDE.
6. Open `.clasp.json`, and replace the `scriptId` with your `Script ID` copied above.
7. You can make any changes you like to the cloned code.
8. Then do the command `clasp push`, and it will replace your copied spreadsheet's Apps Script with your code.
 
## Support for long-running scripts
Google Apps Script has the 6 minute execution time limit. This problem is very tricky. 
You can solve this problem by using the GAS-Terminal's class `LongRun`.
Please see the sample function named `LongRunTest` in [`Code.ts`](https://github.com/inclu-cat/GAS-Terminal/blob/main/src/Code.ts). You also can run the sample command by select the command named `Long-Running Test (Sample)` and can execute it.
