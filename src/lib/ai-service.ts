// FitLife AI - Simulated AI Service
'use client';

import { getProfile, SEEDED_EXERCISES } from './db';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Simple rule-based chatbot processor
export function generateAIResponse(userMessage: string, history: ChatMessage[]): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = userMessage.toLowerCase();
      const profile = getProfile();

      // Basic profile details for contextual responses
      const profileCtx = `Based on your profile (Age: ${profile.age}, Goal: ${profile.goal}, Diet: ${profile.dietPreference}${profile.allergies.length > 0 ? ', Allergies: ' + profile.allergies.join(', ') : ''}):\n\n`;

      // Matchers
      if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
        resolve(`Hello! I am your FitLife AI assistant. I can help answer questions about your workouts, meal plans, calculators, or general exercise science. How can I help you today?`);
        return;
      }

      if (query.includes('pain') || query.includes('hurt') || query.includes('injury') || query.includes('medical') || query.includes('arthritis') || query.includes('blood pressure')) {
        resolve(`**IMPORTANT MEDICAL DISCLAIMER**: I am an AI assistant, not a doctor or licensed physical therapist. For any joint pain, injury, or medical conditions, always consult with a qualified healthcare professional.

Based on safety guidelines for exercise alternatives:
1. **If you have knee pain**: Avoid heavy squats or lunges. Great alternatives include Glute Bridges, swimming, or Supported Wall Sits.
2. **If you have lower back pain**: Avoid exercises that bend or flex the spine under load (like heavy barbell deadlifts or weighted sit-ups). Focus on spinal stabilization like Bird-Dog, Deadbug, and Plank.
3. **If you have high blood pressure**: Avoid holding your breath during lifts (valsalva maneuver) and minimize sustained isometric holds. Keep breathing steadily.
4. **Modified versions**: Always start with bodyweight or wall-supported regressions before progressing to weights.`);
        return;
      }

      if (query.includes('diet') || query.includes('meal') || query.includes('eat') || query.includes('recipe') || query.includes('nutrition')) {
        let response = profileCtx;
        response += `To achieve your goal of **${profile.goal}**, here are key nutrition principles:\n`;
        response += `- **Daily Target**: Prioritize whole, unprocessed foods. Since your preference is **${profile.dietPreference}**, make sure you get enough protein from sources like ${profile.dietPreference === 'Veg' || profile.dietPreference === 'Jain' ? 'tofu, lentils, paneer, and Greek yogurt' : profile.dietPreference === 'Vegan' ? 'tempeh, chickpeas, lentils, and vegan protein powder' : 'chicken breast, salmon, eggs, and Greek yogurt'}.\n`;
        
        if (profile.allergies.length > 0) {
          response += `- **Allergy Alert**: I see you have selected allergies to: **${profile.allergies.join(', ')}**. Make sure to substitute these out of any recipes (e.g. use almond milk instead of dairy milk, or sunflower butter instead of peanut butter).\n`;
        }

        response += `- **Meal Frequency**: You selected a frequency of **${profile.mealFrequency} meals a day**. Distribute your protein evenly across these meals (around 20-30g per meal) to maximize muscle protein synthesis.\n`;
        response += `- **Hydration**: Your daily water goal is **${(profile.waterIntakeGoal / 1000).toFixed(1)}L**. Keep a bottle nearby and drink consistently throughout the day.`;
        resolve(response);
        return;
      }

      if (query.includes('exercise') || query.includes('workout') || query.includes('routine') || query.includes('pushup') || query.includes('squat')) {
        let response = `Here is some guidance on exercise selection and form:\n\n`;
        
        // Find if user mentioned a specific seeded exercise
        const matchedEx = SEEDED_EXERCISES.find(e => query.includes(e.name.toLowerCase()) || e.id.split('-').some(word => query.includes(word)));
        
        if (matchedEx) {
          response += `### Form Focus: **${matchedEx.name}** (${matchedEx.difficulty} level)\n`;
          response += `* **Target Muscles**: ${matchedEx.targetMuscles.join(', ')}\n`;
          response += `* **Correct Posture**: ${matchedEx.posture}\n`;
          response += `* **Key Safety Tip**: ${matchedEx.safetyTips[0]}\n\n`;
          response += `**Steps to perform:**\n` + matchedEx.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') + `\n\n`;
          response += `* **Who should avoid it**: ${matchedEx.avoidIf}`;
        } else {
          response += `For a well-rounded routine, focus on the 5 fundamental movement patterns:\n`;
          response += `1. **Squat** (e.g. Bodyweight squats, goblet squats)\n`;
          response += `2. **Hinge** (e.g. Romanian deadlifts, glute bridges)\n`;
          response += `3. **Push** (e.g. Push-ups, overhead shoulder presses)\n`;
          response += `4. **Pull** (e.g. Dumbbell rows, pull-ups)\n`;
          response += `5. **Carry / Core** (e.g. Farmer walks, planks)\n\n`;
          response += `Since your goal is **${profile.goal}**, aim for 3 resistance sessions per week and 150 minutes of moderate-intensity cardio. Check out our **Age Groups** section for customized advice based on physical development guidelines!`;
        }
        resolve(response);
        return;
      }

      if (query.includes('supplement') || query.includes('creatine') || query.includes('protein powder') || query.includes('caffeine')) {
        resolve(`Supplements should **complement** a balanced diet, not replace it. Here are the top evidence-based recommendations:
1. **Protein Powder**: Great for convenience if you cannot reach your daily protein goal through whole foods.
2. **Creatine Monohydrate (3-5g daily)**: Increases explosive energy and muscular strength by restoring ATP levels.
3. **Omega-3 Fish Oil**: Excellent for joint recovery and heart health if you do not consume fatty fish.
4. **Caffeine**: Acts as an ergogenic aid to increase alertness and power if taken 30-45 minutes before workouts.

*Note: Always consult with a doctor before starting a new supplement regimen, especially if you have pre-existing kidney or heart conditions.*`);
        return;
      }

      if (query.includes('steroid') || query.includes('ped') || query.includes('anabolic') || query.includes('testosterone cycle')) {
        resolve(`**Anabolic Steroids & PED Education**:
Using anabolic steroids or performance-enhancing drugs (PEDs) without direct medical supervision poses severe, documented risks to your health:
- **Cardiovascular**: Increases blood pressure, arterial plaque, and risks of heart attack or stroke.
- **Endocrine**: Shuts down natural hormone production, leading to testicular atrophy, infertility, and severe post-cycle hormone crashes.
- **Hepatic**: Oral steroids can cause severe liver strain, cysts, and potential failure.
- **Mental**: Can trigger mood swings, heightened aggression ("roid rage"), anxiety, and deep depression.

*Legitimate medical uses exist (like treating hypogonadism or muscle wasting from illness), but these require careful prescription and monitoring by an endocrinologist. We strongly advocate for natural, evidence-based training and nutrition.*`);
        return;
      }

      if (query.includes('sleep') || query.includes('recovery') || query.includes('rest')) {
        resolve(`**Sleep & Muscle Growth Recovery**:
Sleep is the single most powerful recovery and growth-promoting tool you have:
1. **Muscle Growth**: Human Growth Hormone (HGH) is primarily released during deep slow-wave sleep. If you cut sleep short, you cut your muscle-building window.
2. **Hormone Balance**: Sleep deprivation increases cortisol (stress hormone) which is catabolic (breaks down muscle) and reduces insulin sensitivity.
3. **Sleep Hygiene Tips**: 
   - Maintain a consistent wake/sleep schedule.
   - Keep your bedroom cool, dark, and quiet.
   - Avoid blue light screens for 1 hour before bed.
   - Avoid caffeine within 8 hours of sleeping.`);
        return;
      }

      if (query.includes('bmi') || query.includes('weight') || query.includes('fat')) {
        resolve(`You can calculate your **BMI (Body Mass Index)**, estimated **Body Fat Percentage**, and **Daily Calorie Targets (BMR/TDEE)** directly in our **Calculators** section!

Once you input your height, weight, activity level, and goals, the calculators will estimate:
- Your Maintenance Calories (TDEE)
- Safe deficits for weight/fat loss (typically TDEE - 500 kcal)
- Surplus targets for muscle/weight gain (typically TDEE + 300 kcal)`);
        return;
      }

      // Default response
      resolve(`Thank you for your question. As your FitLife AI assistant, I recommend focusing on consistency in your workouts, eating allergen-safe, whole nutrient-dense meals, and keeping your sleep above 7-8 hours. 

Could you clarify if you are looking for specific workout exercises, nutritional diet advice, help with the calculators, or information on our age-group guides?`);
    }, 750);
  });
}
