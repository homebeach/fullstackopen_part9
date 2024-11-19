// Define calculateBmi function
export function calculateBmi(height_cm: number, weight_kg: number): string {
    /*
    Calculate BMI (Body Mass Index) based on height in centimeters and weight in kilograms.
    
    Parameters:
        height_cm (number): Height in centimeters.
        weight_kg (number): Weight in kilograms.
        
    Returns:
        string: A message describing the BMI status.
    */
    
    // Convert height from centimeters to meters
    const height_m = height_cm / 100;
    
    // Calculate BMI
    const bmi = weight_kg / (height_m ** 2);
    
    // Interpret BMI and return message
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
        return "Normal weight";
    } else if (bmi >= 25 && bmi < 30) {
        return "Overweight";
    } else {
        return "Obesity";
    }
}

// Export the calculateBmi function
export default calculateBmi;
