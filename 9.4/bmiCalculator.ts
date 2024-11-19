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
module.exports = calculateBmi;

// Check if arguments are provided through npm run command
if (process.argv.length !== 4) {
    console.log("Usage: npm run calculateBmi <height_cm> <weight_kg>");
} else {
    // Extract height and weight from command-line arguments
    const height = Number(process.argv[2]);
    const weight = Number(process.argv[3]);
    
    // Call the function with provided height and weight
    const bmiResult = calculateBmi(height, weight);
    console.log("BMI Status:", bmiResult);
}
