# Simple Password Strength Checker

## Purpose
A lightweight, educational tool designed to help users understand basic password security principles. It evaluates passwords against common security rules and provides actionable feedback.

## Security Rules Used
The tool evaluates passwords based on five fundamental criteria:
1. **Length**: Is the password at least 8 characters long?
2. **Uppercase**: Does it contain at least one capital letter?
3. **Lowercase**: Does it contain at least one small letter?
4. **Numbers**: Does it include at least one digit (0-9)?
5. **Special Characters**: Does it use symbols (e.g., !, @, #, $)?

## Classification Logic
- **Weak**: 0-2 rules passed.
- **Medium**: 3-4 rules passed.
- **Strong**: All 5 rules passed.

## Usage
### Web Version
Simply type your password into the terminal interface in the browser preview.

### Python Version
Run the script using Python 3:
```bash
python3 main.py
```
Follow the on-screen prompt to enter your password and view the analysis.
