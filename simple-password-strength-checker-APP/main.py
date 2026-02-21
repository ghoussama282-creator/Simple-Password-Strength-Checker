import sys

def check_length(password):
    """Rule 1: Check if the password is at least 8 characters long."""
    return len(password) >= 8

def check_uppercase(password):
    """Rule 2: Check for at least one uppercase letter."""
    return any(char.isupper() for char in password)

def check_lowercase(password):
    """Rule 3: Check for at least one lowercase letter."""
    return any(char.islower() for char in password)

def check_numbers(password):
    """Rule 4: Check for at least one numerical digit."""
    return any(char.isdigit() for char in password)

def check_special(password):
    """Rule 5: Check for at least one special character."""
    special_chars = "!@#$%^&*(),.?\":{}|<>"
    return any(char in special_chars for char in password)

def evaluate_strength(password):
    """
    Evaluates the password based on 5 simple rules.
    Returns: (strength_level, issues, recommendations)
    """
    results = {
        "Length (8+)": check_length(password),
        "Uppercase": check_uppercase(password),
        "Lowercase": check_lowercase(password),
        "Numbers": check_numbers(password),
        "Special Characters": check_special(password)
    }
    
    score = sum(results.values())
    issues = [rule for rule, passed in results.items() if not passed]
    
    if score <= 2:
        level = "Weak"
    elif score <= 4:
        level = "Medium"
    else:
        level = "Strong"
        
    recommendations = []
    if not results["Length (8+)"]:
        recommendations.append("Use at least 10-12 characters for better security.")
    if not results["Special Characters"] or not results["Numbers"]:
        recommendations.append("Include a mix of symbols and numbers.")
    if not results["Uppercase"] or not results["Lowercase"]:
        recommendations.append("Mix uppercase and lowercase letters.")
        
    return level, issues, recommendations

def main():
    print("========================================")
    print("   Simple Password Strength Checker")
    print("========================================\n")
    
    try:
        password = input("Enter a password to check: ")
        if not password:
            print("Error: Password cannot be empty.")
            return

        level, issues, recommendations = evaluate_strength(password)
        
        print(f"\nPassword: {password}")
        print(f"Strength: {level}")
        
        if issues:
            print("\nIssues Detected:")
            for issue in issues:
                print(f"- Missing: {issue}")
        
        if recommendations:
            print("\nRecommendations:")
            for rec in recommendations:
                print(f"- {rec}")
                
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)

if __name__ == "__main__":
    main()
