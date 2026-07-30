// FitLife AI - Simulated Database and LocalStorage Client Operations
'use client';

// ==========================================
// 1. DATA TYPE DEFINITIONS
// ==========================================

export interface Exercise {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  equipment: string;
  caloriesPerMin: number;
  posture: string;
  steps: string[];
  benefits: string[];
  avoidIf: string;
  avoidReason?: string;
  alternatives: {
    condition: string;
    alternativeName: string;
    description: string;
    videoUrl?: string;
  }[];
  safetyTips: string[];
  recoveryTime: string; // e.g. "24 hours"
  videoUrl: string; // placeholder text or local graphic index
  kidVideoId?: string; // YouTube ID for kid-friendly video
  kidPosture?: string; // Simplified posture guide
  kidSteps?: string[]; // Simplified step instructions
}

export interface MealRecipe {
  id: string;
  name: string;
  type: 'Breakfast' | 'Mid Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner' | 'Pre Workout' | 'Post Workout' | 'Bedtime Snack';
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  allergens: string[]; // 'milk', 'eggs', 'nuts', 'peanuts', 'soy', 'gluten', 'seafood', 'fish', 'shellfish', 'sesame', 'lactose', 'wheat'
  diets: string[]; // 'Veg', 'Non-Veg', 'Vegan', 'Jain'
  alternatives: string[]; // substitutions
}

export interface AgeGroupData {
  id: string;
  title: string;
  range: string;
  development: string;
  bodyChanges: string;
  exercisesRecommend: string[];
  exercisesAvoid: string[];
  warmup: string[];
  stretches: string[];
  weeklyWorkout: { day: string; routine: string }[];
  recovery: string;
  sleep: string;
  water: string;
  concerns: string[];
}

export interface Supplement {
  name: string;
  summary: string;
  mechanism: string;
  beneficiaries: string;
  dosage: string;
  sideEffects: string[];
  notNecessaryWhen: string;
}

export interface UserStats {
  weightLogs: { date: string; value: number }[];
  waterLogs: { date: string; value: number }[]; // in ml
  stepLogs: { date: string; value: number }[];
  bodyFatLogs: { date: string; value: number }[];
  workoutHistory: { date: string; exerciseName: string; duration: number; calories: number }[];
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    date: string;
  }[];
  favorites: string[]; // Exercise IDs
  completedChallenges: string[]; // Challenge IDs
}

export interface UserProfile {
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
  goal: string;
  activityLevel: string;
  country: string;
  dietPreference: 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain';
  allergies: string[];
  budget: string; // 'low' | 'medium' | 'high'
  workoutTiming: string; // 'Morning' | 'Afternoon' | 'Evening'
  mealFrequency: number;
  waterIntakeGoal: number; // ml
}

// ==========================================
// 2. SEEDED DATASETS
// ==========================================

export const SEEDED_EXERCISES: Exercise[] = [
  {
    id: 'push-up',
    name: 'Standard Push-Up',
    difficulty: 'Beginner',
    targetMuscles: ['Chest (Pectorals)', 'Triceps', 'Front Shoulders (Anterior Deltoids)', 'Core'],
    equipment: 'Bodyweight',
    caloriesPerMin: 7,
    posture: 'Maintain a straight line from head to heels. Hands should be slightly wider than shoulder-width apart, fingers slightly flared.',
    steps: [
      'Start in a high plank position with your hands firmly on the ground.',
      'Engage your core and glutes to keep your body rigid.',
      'Lower your body by bending your elbows, keeping them at a 45-degree angle to your torso, until your chest nearly touches the floor.',
      'Push through your palms to return to the starting plank position.',
      'Repeat while maintaining proper pelvic alignment.'
    ],
    benefits: [
      'Builds upper body pushing strength',
      'Enhances core stability',
      'Requires no equipment and can be done anywhere'
    ],
    avoidIf: 'Severe wrist pain, active shoulder impingement, or recent rotator cuff surgery.',
    avoidReason: 'Puts substantial compression on the wrist joints and anterior shoulder capsules.',
    alternatives: [
      { condition: 'Wrist pain', alternativeName: 'Dumbbell Chest Press on Floor', description: 'Using dumbbells on the floor maintains neutral wrists while training the same chest muscles.', videoUrl: 'https://www.youtube.com/watch?v=mD0VwU_qWJ0' },
      { condition: 'Shoulder injury', alternativeName: 'Wall Push-Ups', description: 'Reduces the load on the shoulders while preserving the horizontal pushing movement pattern.', videoUrl: 'https://www.youtube.com/watch?v=R9Z5851lX0A' },
      { condition: 'Knee pain', alternativeName: 'Standard Push-up', description: 'Standard push-ups do not stress knees, but if kneeling push-ups hurt the knees, use incline/wall push-ups.' }
    ],
    safetyTips: [
      'Do not let your lower back sag; keep core tight.',
      'Avoid flaring your elbows out to 90 degrees as it strains the shoulders.'
    ],
    recoveryTime: '24-48 hours',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    kidVideoId: 'G35bK_s4XQc',
    kidPosture: 'Lie down like a sleepy seal, place your flippers (hands) near your chest, and push your body up while keeping your belly tight like a superhero!',
    kidSteps: [
      'Lie on your tummy and place your hands flat on the floor next to your shoulders.',
      'Squeeze your belly tight so your body is straight like a strong wooden plank.',
      'Push hard against the ground to lift your whole body up!',
      'Lower yourself down slowly, as if you are going to give the floor a gentle kiss, then push back up.'
    ]
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    difficulty: 'Beginner',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves', 'Core'],
    equipment: 'Bodyweight',
    caloriesPerMin: 6,
    posture: 'Stand with feet shoulder-width apart. Keep chest upright, spine neutral, and knees tracking in line with toes.',
    steps: [
      'Stand tall with your feet shoulder-width apart, arms out for balance.',
      'Begin the movement by hinging at your hips and bending your knees, as if sitting back into an invisible chair.',
      'Lower down until your thighs are parallel to the floor (or as deep as flexibility allows safely).',
      'Keep your weight distributed in your heels and mid-foot, do not lift heels.',
      'Push through your feet to return to the starting standing position.'
    ],
    benefits: [
      'Improves lower body mobility and strength',
      'Strengthens connective tissues around hips and knees',
      'Enhances functional balance for daily activities'
    ],
    avoidIf: 'Severe osteoarthritis of the knee, acute lower back spasm, or severe ankle immobility.',
    avoidReason: 'Bending knees past 90 degrees under load can aggregate existing knee issues if joint alignment is poor.',
    alternatives: [
      { condition: 'Knee pain', alternativeName: 'Glute Bridges', description: 'Strengthens the glutes and hamstrings without putting compressive load on the knees.', videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
      { condition: 'Back pain', alternativeName: 'Supported Wall Sit', description: 'Maintains static tension while supporting the lumbar spine against a wall.', videoUrl: 'https://www.youtube.com/watch?v=v6e1T61jR6k' },
      { condition: 'Balance issues', alternativeName: 'Chair Squat', description: 'Perform squats with a chair directly behind you to sit on if balance fails.', videoUrl: 'https://www.youtube.com/watch?v=qgugh6l0zeU' }
    ],
    safetyTips: [
      'Do not let your knees cave inwards (valgus collapse); drive them outwards.',
      'Keep your heels flat on the floor at all times.'
    ],
    recoveryTime: '24 hours',
    videoUrl: 'https://www.youtube.com/watch?v=8uoaYwS6iFM',
    kidVideoId: 'R-kX2bV_n5M',
    kidPosture: 'Stand with your feet apart, look straight ahead, and keep your chest high like a proud king or queen!',
    kidSteps: [
      'Stand with your feet shoulder-width apart, arms out in front like a superhero flying.',
      'Bend your knees and pretend you are sitting down on a low, invisible chair.',
      'Go down until your thighs are flat like a table, keeping your feet flat on the floor (don\'t lift your heels!).',
      'Push through your feet to stand back up tall!'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    difficulty: 'Intermediate',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Lower Back (Erector Spinae)', 'Forearms'],
    equipment: 'Dumbbells',
    caloriesPerMin: 8,
    posture: 'Stand with feet hip-width apart holding dumbbells in front of thighs. Maintain a flat back with shoulders packed down.',
    steps: [
      'Stand with feet hip-width apart, dumbbells resting on your upper thighs.',
      'Soften your knees slightly (do not lock them, but do not squat).',
      'Hinge at your hips, pushing them straight backward, letting the dumbbells slide down close to your shins.',
      'Lower until you feel a deep stretch in your hamstrings, keeping your spine completely straight.',
      'Contract your hamstrings and glutes to pull your hips forward and stand tall.'
    ],
    benefits: [
      'Primary builder of the posterior chain',
      'Improves athletic power and jumping height',
      'Teaches correct lifting mechanics for daily heavy objects'
    ],
    avoidIf: 'Herniated disc or acute lower back strain.',
    avoidReason: 'Imposes shear forces on the lumbar spine if form deviates even slightly from neutral.',
    alternatives: [
      { condition: 'Back pain', alternativeName: 'Stability Ball Leg Curls', description: 'Trains hamstrings under high tension with virtually zero load on the lumbar spine.', videoUrl: 'https://www.youtube.com/watch?v=mO_J7aG_640' },
      { condition: 'Limited mobility', alternativeName: 'Kettlebell Sumo Deadlift from Block', description: 'Shortens the range of motion, letting the spine stay neutral.', videoUrl: 'https://www.youtube.com/watch?v=L8zXhQ1z8v0' }
    ],
    safetyTips: [
      'Never round your spine; keep the shoulder blades retracted.',
      'Keep the weights close to your legs; letting them drift forward increases lower back strain.'
    ],
    recoveryTime: '48 hours',
    videoUrl: 'https://www.youtube.com/shorts/5rIqP63yWFg',
    kidVideoId: 'sZ_uV-zYq30',
    kidPosture: 'Hold light bottles or toys, keep your back flat like a table, and bend at your hips like a playful gorilla!',
    kidSteps: [
      'Stand straight holding light dumbbells or water bottles in front of your legs.',
      'Keep your knees just slightly bent—don\'t bend them all the way like a squat.',
      'Push your hips straight back as if you are trying to shut a door behind you with your bottom.',
      'Let the weights slide down your legs until they pass your knees, keeping your back super flat.',
      'Stand back up tall and squeeze your bottom muscles tight!'
    ]
  },
  {
    id: 'overhead-press',
    name: 'Dumbbell Overhead Shoulder Press',
    difficulty: 'Intermediate',
    targetMuscles: ['Shoulders (Deltoids)', 'Triceps', 'Upper Chest', 'Core'],
    equipment: 'Dumbbells',
    caloriesPerMin: 6.5,
    posture: 'Stand or sit with spine upright. Hold dumbbells at shoulder height with elbows positioned slightly forward in the scapular plane.',
    steps: [
      'Hold dumbbells at shoulder level with a neutral or slightly pronated grip.',
      'Brace your core and squeeze your glutes to establish a stable base.',
      'Press the dumbbells straight up overhead, fully extending your arms without locking your elbows.',
      'Avoid arching your lower back as the weight goes up.',
      'Lower the dumbbells slowly back to the starting shoulder height.'
    ],
    benefits: [
      'Develops shoulder width and strength',
      'Strengthens the core stabilizer muscles',
      'Improves overhead shoulder mobility'
    ],
    avoidIf: 'Shoulder impingement, active bursitis, or rotator cuff tears.',
    avoidReason: 'Overhead pressing narrows the subacromial space, pinching inflamed tendons.',
    alternatives: [
      { condition: 'Shoulder injury', alternativeName: 'Dumbbell Lateral Raises (Light)', description: 'Works the lateral deltoid with lower total load and no vertical overhead extension.', videoUrl: 'https://www.youtube.com/watch?v=kZ1tZ135T7I' },
      { condition: 'Back pain', alternativeName: 'Seated Incline Chest Press (30 deg)', description: 'Reduces direct lumbar compression while targeting the shoulders and upper chest.', videoUrl: 'https://www.youtube.com/watch?v=M5G-8Jm2H-U' }
    ],
    safetyTips: [
      'Do not flare your elbows completely to the sides; keep them at a 30-degree angle forward.',
      'Keep your ribs tucked; do not puff your chest out excessively.'
    ],
    recoveryTime: '24-48 hours',
    videoUrl: 'https://www.youtube.com/shorts/osEKVtXBLlU',
    kidVideoId: 'g5QYyD22l3c',
    kidPosture: 'Hold light weights at your shoulders, stand tall, and press them up high to touch the clouds!',
    kidSteps: [
      'Hold your light weights or water bottles at your shoulders with your elbows pointing forward.',
      'Stand tall and tighten your belly so you stay steady.',
      'Push the weights straight up into the air until your arms are straight.',
      'Slowly bring them back down to your shoulders and do it again!'
    ]
  },
  {
    id: 'bird-dog',
    name: 'Bird-Dog Stability Exercise',
    difficulty: 'Beginner',
    targetMuscles: ['Core (Transversus Abdominis)', 'Glutes', 'Lower Back', 'Shoulders'],
    equipment: 'Bodyweight',
    caloriesPerMin: 4,
    posture: 'All-fours table-top position. Hands under shoulders, knees under hips. Spine aligned in neutral.',
    steps: [
      'Position yourself on hands and knees, keeping your gaze downward.',
      'Slowly extend your right arm forward while simultaneously extending your left leg straight back.',
      'Hold the extended position for 2 seconds, reaching through your fingers and heel.',
      'Keep your hips level to the ground; do not let them rotate.',
      'Slowly return to the starting position and switch to the opposite arm and leg.'
    ],
    benefits: [
      'Trains core stability without spinal flexion',
      'Recommended for back pain rehabilitation',
      'Improves coordination and balance'
    ],
    avoidIf: 'Acute shoulder dislocation or severe balance disorder.',
    avoidReason: 'Requires unilateral loading on the shoulder and hip joint.',
    alternatives: [
      { condition: 'Shoulder injury', alternativeName: 'Glute Bridges', description: 'Targets glutes and lower back with no arm involvement.', videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
      { condition: 'Limited mobility', alternativeName: 'Dead Bug', description: 'Lying on your back performs the same diagonal core pattern without weight bearing.', videoUrl: 'https://www.youtube.com/watch?v=pG4i59s5hV0' }
    ],
    safetyTips: [
      'Do not lift your leg too high (which arches the lower back); focus on kicking backward.',
      'Keep your neck neutral; do not look up.'
    ],
    recoveryTime: '12-24 hours',
    videoUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    kidVideoId: 'oZ-mZ5-uS4o',
    kidPosture: 'Get on all-fours like a puppy dog, and stretch one arm and the opposite leg out straight like a pointing dog!',
    kidSteps: [
      'Get on your hands and knees on the floor like a puppy dog.',
      'Keep your back flat like a table and look down at the floor.',
      'Slowly stretch your right arm forward and your left leg straight back at the same time.',
      'Hold your balance like a statue for 2 seconds, then bring them back down.',
      'Switch sides: stretch your left arm forward and your right right back!'
    ]
  }
];

export const SEEDED_DIETS: MealRecipe[] = [
  {
    id: 'oatmeal-berries',
    name: 'High-Protein Berry Oatmeal',
    type: 'Breakfast',
    calories: 380,
    protein: 25,
    carbs: 48,
    fat: 8,
    fiber: 9,
    prepTime: '8 mins',
    ingredients: [
      '1/2 cup rolled oats',
      '1 cup water or unsweetened almond milk',
      '1 scoop vanilla whey/plant protein powder',
      '1/2 cup mixed berries (blueberries, raspberries)',
      '1 tbsp chia seeds',
      '10 crushed almonds'
    ],
    instructions: [
      'Bring water or almond milk to a boil in a small pot, add oats, and reduce heat to low.',
      'Simmer for 5 minutes, stirring occasionally, until oats are soft and thick.',
      'Remove from heat and let cool for 1 minute.',
      'Stir in the protein powder quickly to avoid clumping (add a splash of water if too dry).',
      'Top with mixed berries, chia seeds, and almonds.'
    ],
    allergens: ['milk', 'nuts'],
    diets: ['Veg', 'Non-Veg', 'Vegan'], // Vegan if plant protein + water
    alternatives: ['Use water instead of milk', 'Sub seeds for nuts', 'Use soy protein for whey']
  },
  {
    id: 'scrambled-tofu-avocado',
    name: 'Turmeric Tofu Scramble with Avocado',
    type: 'Breakfast',
    calories: 320,
    protein: 20,
    carbs: 12,
    fat: 22,
    fiber: 7,
    prepTime: '12 mins',
    ingredients: [
      '150g firm tofu (mashed with a fork)',
      '1/4 avocado (sliced)',
      '1 cup fresh spinach leaves',
      '1/2 tsp turmeric powder',
      'Salt, pepper, and garlic powder to taste',
      '1 tsp olive oil'
    ],
    instructions: [
      'Heat olive oil in a non-stick skillet over medium heat.',
      'Add the crumbled tofu, turmeric, garlic powder, salt, and pepper.',
      'Sauté for 6-8 minutes until tofu is lightly golden.',
      'Toss in the spinach and cook until wilted.',
      'Serve warm topped with fresh avocado slices.'
    ],
    allergens: ['soy'],
    diets: ['Veg', 'Vegan', 'Jain'], // Jain if no garlic powder
    alternatives: ['Sub scrambled eggs for tofu if not vegan', 'Use olive oil instead of butter']
  },
  {
    id: 'greek-yogurt-fruit',
    name: 'Greek Yogurt & Honey Fruit Pot',
    type: 'Mid Morning Snack',
    calories: 210,
    protein: 18,
    carbs: 22,
    fat: 3,
    fiber: 3,
    prepTime: '3 mins',
    ingredients: [
      '1 cup plain non-fat Greek yogurt',
      '1/2 sliced banana or apple',
      '1 tsp raw organic honey',
      '1/2 tsp ground cinnamon'
    ],
    instructions: [
      'Scoop Greek yogurt into a serving bowl.',
      'Arrange sliced fruits on top.',
      'Drizzle with honey and sprinkle cinnamon over the top.'
    ],
    allergens: ['milk', 'lactose'],
    diets: ['Veg', 'Non-Veg'],
    alternatives: ['Use coconut yogurt for dairy/lactose allergy', 'Use maple syrup instead of honey for strict vegans']
  },
  {
    id: 'quinoa-salmon-bowl',
    name: 'Grilled Salmon with Quinoa & Steamed Broccoli',
    type: 'Lunch',
    calories: 520,
    protein: 38,
    carbs: 42,
    fat: 18,
    fiber: 6,
    prepTime: '20 mins',
    ingredients: [
      '150g fresh salmon fillet',
      '1/2 cup cooked quinoa',
      '1.5 cups broccoli florets',
      '1 tbsp lemon juice',
      '1 tsp olive oil',
      'Pinch of dried dill, salt, and pepper'
    ],
    instructions: [
      'Season the salmon fillet with lemon juice, dill, salt, and pepper.',
      'Heat olive oil in a pan and sear salmon for 4-5 minutes on each side until fully cooked.',
      'Steam broccoli florets in a basket or microwave for 4 minutes until vibrant green.',
      'Plate the cooked quinoa, place the salmon on top, and arrange broccoli to the side.',
      'Squeeze fresh lemon over the entire dish.'
    ],
    allergens: ['fish'],
    diets: ['Non-Veg'],
    alternatives: ['Sub baked tempeh or tofu for salmon if vegetarian', 'Use brown rice instead of quinoa']
  },
  {
    id: 'jain-chana-masala',
    name: 'No-Root Chana Masala (Jain Chickpeas)',
    type: 'Lunch',
    calories: 390,
    protein: 16,
    carbs: 58,
    fat: 9,
    fiber: 14,
    prepTime: '25 mins',
    ingredients: [
      '1 cup boiled chickpeas',
      '2 fresh tomatoes (pureed)',
      '1 tsp ginger paste (optional, omit for strict rules if root is restricted)',
      '1 tsp cumin seeds',
      'Spices: Coriander, turmeric, red chili, and garam masala',
      '1 tsp oil'
    ],
    instructions: [
      'Heat oil in a pan and temper with cumin seeds.',
      'Pour in the fresh tomato puree and cook until the oil starts to separate.',
      'Stir in the dry spices and cook for another minute.',
      'Add the boiled chickpeas along with a cup of water.',
      'Simmer on medium-low for 15 minutes until thick. Mash a few chickpeas to thicken gravy.',
      'Garnish with fresh coriander leaves.'
    ],
    allergens: [],
    diets: ['Veg', 'Vegan', 'Jain'],
    alternatives: ['Add spinach for extra iron', 'Pair with flatbread or brown rice']
  },
  {
    id: 'almonds-apple',
    name: 'Apple Slices with Natural Peanut Butter',
    type: 'Evening Snack',
    calories: 190,
    protein: 5,
    carbs: 20,
    fat: 12,
    fiber: 5,
    prepTime: '3 mins',
    ingredients: [
      '1 medium organic apple',
      '1.5 tbsp natural unsweetened peanut butter'
    ],
    instructions: [
      'Core and cut the apple into wedge slices.',
      'Dip or spread the peanut butter over each wedge.'
    ],
    allergens: ['peanuts'],
    diets: ['Veg', 'Non-Veg', 'Vegan', 'Jain'],
    alternatives: ['Use sunflower seed butter or almond butter for peanut allergies']
  },
  {
    id: 'chicken-sweet-potato',
    name: 'Lemon-Herb Chicken Breast with Roasted Sweet Potato',
    type: 'Dinner',
    calories: 460,
    protein: 42,
    carbs: 35,
    fat: 10,
    fiber: 5,
    prepTime: '25 mins',
    ingredients: [
      '150g skinless chicken breast',
      '150g sweet potato (cubed)',
      '1 cup green beans',
      '1 tsp olive oil',
      'Thyme, rosemary, garlic powder, salt, and pepper'
    ],
    instructions: [
      'Preheat oven or air fryer to 200°C (400°F).',
      'Toss sweet potato cubes in half of the olive oil and herbs. Roast for 20 minutes.',
      'Season chicken breast with herbs, garlic, salt, and pepper.',
      'Sauté chicken breast in a skillet with remaining oil for 6 minutes per side.',
      'Steam green beans for 5 minutes.',
      'Plate the chicken, roasted potatoes, and green beans together.'
    ],
    allergens: [],
    diets: ['Non-Veg'],
    alternatives: ['Sub paneer or thick tofu slices for chicken breast', 'Use regular potatoes or quinoa']
  },
  {
    id: 'lentil-soup',
    name: 'Hearty Lentil & Spinach Stew',
    type: 'Dinner',
    calories: 340,
    protein: 19,
    carbs: 48,
    fat: 6,
    fiber: 12,
    prepTime: '30 mins',
    ingredients: [
      '1/2 cup brown or green lentils (washed)',
      '1/2 cup diced carrots',
      '1 cup chopped spinach',
      '2 cups vegetable broth',
      '1/2 tsp cumin, salt, and black pepper',
      '1 tsp olive oil'
    ],
    instructions: [
      'In a saucepan, heat olive oil and sauté carrots for 3 minutes.',
      'Add the lentils, cumin, and vegetable broth. Bring to a boil.',
      'Cover and simmer on low heat for 25 minutes until lentils are fully tender.',
      'Stir in the chopped spinach during the last 2 minutes until just wilted.',
      'Season with salt and pepper, and enjoy warm.'
    ],
    allergens: [],
    diets: ['Veg', 'Vegan', 'Jain'], // Jain if carrots are omitted
    alternatives: ['Add chopped tomatoes', 'Stir in nutritional yeast for a cheesy flavor']
  },
  {
    id: 'banana-whey',
    name: 'Pre-Workout Energizer Shake',
    type: 'Pre Workout',
    calories: 240,
    protein: 26,
    carbs: 28,
    fat: 2,
    fiber: 3,
    prepTime: '2 mins',
    ingredients: [
      '1 scoop whey isolate (or soy isolate for dairy-free)',
      '1 medium ripe banana',
      '1 cup cold water'
    ],
    instructions: [
      'Combine all items in a high-speed blender.',
      'Blend for 30 seconds until completely smooth. Consume 45 minutes before training.'
    ],
    allergens: ['milk'], // milk if whey is used
    diets: ['Veg', 'Non-Veg'],
    alternatives: ['Use pea protein for vegan option', 'Use coconut water for extra electrolytes']
  },
  {
    id: 'whey-dextrose',
    name: 'Post-Workout Recovery Formula',
    type: 'Post Workout',
    calories: 280,
    protein: 30,
    carbs: 35,
    fat: 1,
    fiber: 0,
    prepTime: '2 mins',
    ingredients: [
      '1.2 scoops clean whey isolate',
      '2 tbsp dextrose or maple syrup',
      '1.2 cups cold water',
      'Pinch of sea salt'
    ],
    instructions: [
      'Add ingredients to a shaker bottle.',
      'Shake vigorously for 20 seconds. Drink immediately post-exercise to replenish glycogen and trigger muscle protein synthesis.'
    ],
    allergens: ['milk'],
    diets: ['Veg', 'Non-Veg'],
    alternatives: ['Use brown rice protein for vegan option']
  },
  {
    id: 'casein-almond',
    name: 'Slow-Release Bedtime Casein Pudding',
    type: 'Bedtime Snack',
    calories: 180,
    protein: 25,
    carbs: 6,
    fat: 6,
    fiber: 1,
    prepTime: '4 mins',
    ingredients: [
      '1 scoop Micellar Casein (provides slow digestion over 8 hours)',
      '1 tbsp almond butter',
      '1/2 cup cold unsweetened almond milk'
    ],
    instructions: [
      'In a mug or small bowl, slowly stir almond milk into the casein powder.',
      'Mix carefully until it forms a thick, pudding-like consistency.',
      'Stir in the almond butter. Eat with a spoon before sleeping.'
    ],
    allergens: ['milk', 'nuts', 'lactose'],
    diets: ['Veg', 'Non-Veg'],
    alternatives: ['Use soy or pea protein pudding for dairy-free', 'Substitute pumpkin seed butter for almond butter']
  }
];

export const SEEDED_AGE_GROUPS: AgeGroupData[] = [
  {
    id: 'children',
    title: 'Children',
    range: '5–12 years',
    development: 'Rapid bone growth, building motor coordination, and developing baseline cardiovascular patterns.',
    bodyChanges: 'Growth plates are active. Muscular strength increases naturally through physical play. Heart rates are naturally higher.',
    exercisesRecommend: [
      'Active free play (tag, jungle gyms)',
      'Structured balance work (single-leg stands, gymnastics)',
      'Bodyweight movement patterns (bear crawls, frog jumps)',
      'Light cardiovascular exercises (swimming, cycling)'
    ],
    exercisesAvoid: [
      'Maximal heavy lifting (1-repetition max attempts)',
      'High-impact repetitive jumping on hard concrete surfaces',
      'Unsupervised fitness machines designed for adult heights'
    ],
    warmup: [
      '5 minutes of fun dynamic games (e.g. shadow tagging)',
      'Arm circles and torso rotations (10 reps each)'
    ],
    stretches: [
      'Cobra stretch for core flexibility (hold 10s)',
      'Butterfly groin stretch (hold 15s)'
    ],
    weeklyWorkout: [
      { day: 'Mon/Wed/Fri', routine: '60 minutes of active play (running, tag, playground crawling)' },
      { day: 'Tue/Thu', routine: 'Skill games: throwing, catching, swimming, or balancing' },
      { day: 'Sat/Sun', routine: 'Family hiking, bicycling, or casual soccer' }
    ],
    recovery: 'Focus on varied play. Rest immediately when tired. Avoid structured muscle split training.',
    sleep: '9–11 hours per night (vital for growth hormone secretion).',
    water: '1.2 to 1.8 liters daily (more if active in hot climates).',
    concerns: ['Sedentary screen time replacing play', 'Early specialization causing repetitive strain injuries']
  },
  {
    id: 'teenagers',
    title: 'Teenagers',
    range: '13–17 years',
    development: 'Hormonal surges (testosterone & estrogen), rapid skeletal lengthening, and neural system maturation.',
    bodyChanges: 'Growth spurts can temporarily reduce coordination. Increased muscle building capability. Bone density accretion is at its peak.',
    exercisesRecommend: [
      'Introductory resistance training using correct bodyweight postures (push-ups, bodyweight squats)',
      'Light external loads (dumbbells, resistance bands) focusing on form',
      'Coordination sports (basketball, martial arts)',
      'Moderate cardio (running, swimming, rowing)'
    ],
    exercisesAvoid: [
      'Heavy spinal compression exercises without professional instruction (e.g. heavy barbell overhead press)',
      'Extreme calorie deprivation or restrictive diets'
    ],
    warmup: [
      '5 mins of skipping rope or jogging',
      'Dynamic leg swings and lunges (12 reps per leg)'
    ],
    stretches: [
      'Hamstring sweep stretch',
      'Pec doorframe stretch'
    ],
    weeklyWorkout: [
      { day: 'Mon/Wed/Fri', routine: 'Form-focused resistance training (squats, pushups, rows) - 30-40 mins' },
      { day: 'Tue/Thu', routine: 'Cardiovascular training or sport practice - 45 mins' },
      { day: 'Sat/Sun', routine: 'Active outdoor recreation and full physical recovery' }
    ],
    recovery: 'Allow 48 hours before training the same muscle group. Focus on food fuel.',
    sleep: '8–10 hours per night (accommodates massive growth spurts).',
    water: '1.8 to 2.4 liters daily.',
    concerns: ['Poor posture from heavy schoolbags and screen viewing', 'Body image pressure causing eating disorders']
  },
  {
    id: 'young-adults',
    title: 'Young Adults',
    range: '18–25 years',
    development: 'Peak muscular adaptation potential, maximum bone density, and fully matured nervous system.',
    bodyChanges: 'Optimal recovery rates, high testosterone/estrogen baselines, and maximum structural joint tolerance.',
    exercisesRecommend: [
      'Compound resistance training (barbell squats, deadlifts, chest press)',
      'High-Intensity Interval Training (HIIT)',
      'Advanced flexibility and mobility routines'
    ],
    exercisesAvoid: [
      'Lifting heavy with poor posture or ego lifting',
      'Neglecting recovery and sleep due to social/academic schedules'
    ],
    warmup: [
      '8 mins of dynamic movement or row machine',
      'World’s Greatest Stretch (5 reps per side)'
    ],
    stretches: [
      'Deep glute figure-4 stretch',
      'Calf and Achilles stretch'
    ],
    weeklyWorkout: [
      { day: 'Mon/Wed/Fri', routine: 'Upper/Lower split or full-body compound resistance lifting' },
      { day: 'Tue/Thu', routine: 'HIIT cardio or sports training - 30-40 mins' },
      { day: 'Saturday', routine: 'Mobility flow and core stability' },
      { day: 'Sunday', routine: 'Complete rest day' }
    ],
    recovery: 'Can handle higher volume, but requires nutritional adequacy (macros) and hydration.',
    sleep: '7–9 hours per night.',
    water: '2.5 to 3.5 liters daily.',
    concerns: ['Alcohol and junk food affecting recovery', 'Overtraining due to rapid goals expectation']
  },
  {
    id: 'adults-younger',
    title: 'Adults (Early)',
    range: '26–35 years',
    development: 'Stabilization of metabolism. Career and lifestyle demands often introduce desk-bound sitting stresses.',
    bodyChanges: 'Slight decrease in baseline calorie requirements. First signs of joint stiffness if sedentary.',
    exercisesRecommend: [
      'Resistance training for muscle maintenance (3-4 times a week)',
      'Posterior chain focus to counteract desk sitting (RDLs, face-pulls)',
      'Zone 2 cardiovascular base training (jogging, brisk walking)'
    ],
    exercisesAvoid: [
      'Sudden high-impact movements without warm-up (the "weekend warrior" injury hazard)'
    ],
    warmup: [
      '5 mins dynamic walking lunges',
      'Shoulder pass-throughs using a band'
    ],
    stretches: [
      'Hip flexor kneeling lunge stretch',
      'Thoracic spine foam rolling'
    ],
    weeklyWorkout: [
      { day: 'Mon/Wed/Fri', routine: 'Strength training: focus on posture and heavy compounds (45 mins)' },
      { day: 'Tue/Thu', routine: '30-40 mins of steady-state cardiovascular training' },
      { day: 'Saturday', routine: 'Yoga, stretching, or active walking' },
      { day: 'Sunday', routine: 'Active recovery / Rest' }
    ],
    recovery: 'Active mobility work, stretching, and proper hydration.',
    sleep: '7–8 hours per night.',
    water: '2.5 to 3.0 liters daily.',
    concerns: ['Desk job stiffness and tight hip flexors', 'Stress levels increasing cortisol']
  },
  {
    id: 'adults-mid',
    title: 'Adults (Mid)',
    range: '36–45 years',
    development: 'Natural gradual drop in muscle mass (sarcopenia onset if untrained) and slight decline in ligament elasticity.',
    bodyChanges: 'Hormonal declines (gradual drop in growth hormone and free testosterone). Fat stores may accumulate around abdomen more easily.',
    exercisesRecommend: [
      'Strength training (mandatory to fight bone/muscle loss)',
      'Joint-friendly cardio (elliptical, cycling, swimming)',
      'Core stabilization (planks, bird-dogs)'
    ],
    exercisesAvoid: [
      'Extremely high joint-compression exercises if joint aches exist',
      'High-impact landing maneuvers (box jumps) unless well-conditioned'
    ],
    warmup: [
      '10 mins of walking and joint circles',
      'Glute bridge activation sets (15 reps)'
    ],
    stretches: [
      'Child\'s Pose for back decompression',
      'Hamstring strap stretches'
    ],
    weeklyWorkout: [
      { day: '3 Days/Week', routine: 'Full-body resistance training focused on controlled repetitions (30-45 mins)' },
      { day: '2 Days/Week', routine: 'Low-impact cardiovascular conditioning (cycling or swimming)' },
      { day: 'Weekend', routine: 'Outdoor walking and dedicated family mobility sessions' }
    ],
    recovery: 'Higher recovery windows needed. Consider light massage, hot bath, and magnesium supplementation.',
    sleep: '7–8 hours per night.',
    water: '2.5 to 3.0 liters daily.',
    concerns: ['Increasing risk of high blood pressure', 'Loss of range of motion in shoulders and hips']
  },
  {
    id: 'adults-mature',
    title: 'Adults (Mature)',
    range: '46–60 years',
    development: 'Significant hormonal shifts (menopause in women, andropause in men). Core focus is maintaining bone density and cardiovascular reserve.',
    bodyChanges: 'Bone mineral density drops (especially post-menopausal women). Joint cartilage thins. Metobolic rate decreases.',
    exercisesRecommend: [
      'Weight-bearing resistance training (preserves bone mass and prevents osteoporosis)',
      'Balance drills (stops fall risks early)',
      'Moderate-intensity cardio (brisk walks, water aerobics)'
    ],
    exercisesAvoid: [
      'Spinal flexion under heavy loads (e.g. heavy barbell squats or traditional sit-ups with load)',
      'Ballistic sudden twisting movements'
    ],
    warmup: [
      '10 minutes of gentle full-body mobility exercises',
      'Supported knee raises'
    ],
    stretches: [
      'Standing calf stretch against wall',
      'Seated hamstring reach'
    ],
    weeklyWorkout: [
      { day: 'Mon/Thu', routine: 'Resistance training: focus on machines or stable dumbbell exercises (30 mins)' },
      { day: 'Tue/Fri', routine: 'Brisk walking or swimming (Zone 2 cardio) - 30 mins' },
      { day: 'Wednesday', routine: 'Balance training: single leg stance, tandem walking, and stretching' },
      { day: 'Weekend', routine: 'Rest and active light gardening or walking' }
    ],
    recovery: 'Allow 72 hours for high-exertion muscles. Focus on protein intake to counter resistance listlessness.',
    sleep: '7–8 hours per night.',
    water: '2.0 to 2.5 liters daily.',
    concerns: ['Osteopenia and joint arthritis', 'Loss of balance and ankle mobility']
  },
  {
    id: 'seniors',
    title: 'Seniors',
    range: '60+ years',
    development: 'Preservation of physical autonomy, balance, and cognitive function.',
    bodyChanges: 'Reduced muscle fiber size, stiffened arterial walls, and thinning of spinal discs.',
    exercisesRecommend: [
      'Supported resistance training (seated chest press, leg press, wall sits)',
      'Balance-specific training (tandem standing, tai chi)',
      'Low-impact continuous movements (brisk walking, water aerobics)'
    ],
    exercisesAvoid: [
      'Exercises with high falling hazards (treadmill running without handrails, heavy free-weight standing squats)',
      'Rapid positional changes that cause dizziness (orthostatic hypotension)'
    ],
    warmup: [
      '5-10 minutes of slow rhythmic walking',
      'Arm reaches and shoulder rolls while seated'
    ],
    stretches: [
      'Chest stretch while seated in a chair',
      'Gentle neck rotations and ankle rolls'
    ],
    weeklyWorkout: [
      { day: 'Mon/Wed/Fri', routine: 'Low-impact walking (20-30 mins) followed by 3 balance drills' },
      { day: 'Tue/Thu', routine: 'Chair-based or machine-supported resistance training (20 mins)' },
      { day: 'Sat/Sun', routine: 'Stretching, breathing exercises, and gentle stretching' }
    ],
    recovery: 'Focus on sleep, immediate rest after any fatigue, and high nutrient-density foods.',
    sleep: '7–8 hours per night (older adults may experience fragmented sleep; focus on consistency).',
    water: '2.0 liters daily (thirst mechanism naturally declines with age, making scheduled drinking important).',
    concerns: ['Sarcopenia (severe muscle wasting)', 'Fall risk causing hip fractures', 'Dehydration']
  }
];

export const SEEDED_SUPPLEMENTS: Supplement[] = [
  {
    name: 'Protein Powder (Whey / Plant)',
    summary: 'A fast-digesting, convenient source of dietary protein that aids muscle repair and synthesis.',
    mechanism: 'Provides essential amino acids (especially Leucine) that trigger muscle protein synthesis (MPS) via the mTOR pathway.',
    beneficiaries: 'Athletes, people struggling to reach daily protein goals, vegetarians, and seniors fighting muscle wasting.',
    dosage: '15–30g post-workout or as needed to hit daily protein targets.',
    sideEffects: [
      'Digestive distress (bloating, gas) in people with lactose sensitivity (if using low-grade whey concentrate).',
      'No major side effects for healthy individuals.'
    ],
    notNecessaryWhen: 'You easily hit your target protein intake (e.g. 1.6-2.2g per kg of bodyweight) purely through whole foods like chicken, tofu, eggs, and lentils.'
  },
  {
    name: 'Creatine Monohydrate',
    summary: 'The most researched sports supplement in the world. Increases quick explosive energy, strength, and brain health.',
    mechanism: 'Increases cellular phosphocreatine stores, allowing rapid regeneration of Adenosine Triphosphate (ATP) during intense anaerobic exercises.',
    beneficiaries: 'Weightlifters, sprinters, vegetarians (who get low natural dietary creatine), and aging populations.',
    dosage: '3–5g daily, taken consistently at any time of the day. No cycling off is required.',
    sideEffects: [
      'Mild water retention inside the muscle cells (makes muscles look fuller).',
      'Stomach cramping if taken with insufficient water.'
    ],
    notNecessaryWhen: 'It is rarely "unnecessary" for strength sports, but it is not needed if your fitness goals are purely low-intensity cardio or general moderate walking.'
  },
  {
    name: 'Omega-3 Fish Oil',
    summary: 'Essential fatty acids that support cardiovascular health, joint health, and brain function.',
    mechanism: 'Incorporates EPA and DHA into cell membranes, exerting anti-inflammatory effects and supporting blood lipid profiles.',
    beneficiaries: 'People who do not eat fatty fish weekly, individuals with joint soreness, and those seeking heart support.',
    dosage: '1000–2000mg of combined EPA/DHA daily, taken with a fat-containing meal.',
    sideEffects: [
      'Mild fishy aftertaste or burps.',
      'Slight blood-thinning effect at very high doses.'
    ],
    notNecessaryWhen: 'You consume fatty fish (like salmon, sardines, or mackerel) 2–3 times a week.'
  },
  {
    name: 'Vitamin D3',
    summary: 'A fat-soluble hormone-precursor vital for calcium absorption, bone health, immune function, and testosterone levels.',
    mechanism: 'Regulates calcium absorption in the gut and supports muscular contractions and bone mineralization.',
    beneficiaries: 'People living in northern latitudes, indoor workers, dark-skinned individuals, and seniors.',
    dosage: '1000–4000 IU daily based on blood tests, taken with a meal.',
    sideEffects: [
      'Toxicity is very rare, but chronic extreme doses (>10,000 IU daily) can lead to hypercalcemia.'
    ],
    notNecessaryWhen: 'You get 15-20 minutes of midday sun exposure daily with bare skin and have verified healthy serum levels.'
  }
];

// ==========================================
// 3. STORAGE & SIMULATION OPERATIONS
// ==========================================

const PROFILE_KEY = 'fitlife_user_profile';
const STATS_KEY = 'fitlife_user_stats';

const DEFAULT_PROFILE: UserProfile = {
  age: 28,
  gender: 'Male',
  height: 175,
  weight: 74,
  goal: 'General Wellness',
  activityLevel: 'Moderate',
  country: 'United States',
  dietPreference: 'Non-Veg',
  allergies: [],
  budget: 'medium',
  workoutTiming: 'Morning',
  mealFrequency: 4,
  waterIntakeGoal: 2500
};

const DEFAULT_STATS: UserStats = {
  weightLogs: [
    { date: '2026-07-17', value: 75.2 },
    { date: '2026-07-18', value: 75.0 },
    { date: '2026-07-19', value: 74.8 },
    { date: '2026-07-20', value: 74.5 },
    { date: '2026-07-21', value: 74.3 },
    { date: '2026-07-22', value: 74.1 },
    { date: '2026-07-23', value: 74.0 }
  ],
  waterLogs: [
    { date: '2026-07-20', value: 2000 },
    { date: '2026-07-21', value: 2500 },
    { date: '2026-07-22', value: 2200 },
    { date: '2026-07-23', value: 1500 }
  ],
  stepLogs: [
    { date: '2026-07-20', value: 8500 },
    { date: '2026-07-21', value: 10200 },
    { date: '2026-07-22', value: 9100 },
    { date: '2026-07-23', value: 6400 }
  ],
  bodyFatLogs: [
    { date: '2026-07-17', value: 18.5 },
    { date: '2026-07-23', value: 18.1 }
  ],
  workoutHistory: [
    { date: '2026-07-20', exerciseName: 'Standard Push-Up', duration: 15, calories: 105 },
    { date: '2026-07-21', exerciseName: 'Bodyweight Squat', duration: 20, calories: 120 },
    { date: '2026-07-22', exerciseName: 'Dumbbell Romanian Deadlift (RDL)', duration: 25, calories: 200 }
  ],
  measurements: [
    { chest: 98, waist: 84, hips: 96, arms: 34, date: '2026-07-17' },
    { chest: 98, waist: 83, hips: 95, arms: 34.2, date: '2026-07-23' }
  ],
  favorites: ['push-up', 'bodyweight-squat'],
  completedChallenges: ['water-hydration-streak']
};

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile to localStorage', e);
  }
}

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats to localStorage', e);
  }
}

// Log a water event
export function logWater(amount: number): UserStats {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = stats.waterLogs.find(l => l.date === today);
  if (todayLog) {
    todayLog.value += amount;
  } else {
    stats.waterLogs.push({ date: today, value: amount });
  }
  saveStats(stats);
  return stats;
}

// Log steps
export function logSteps(stepsCount: number): UserStats {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = stats.stepLogs.find(l => l.date === today);
  if (todayLog) {
    todayLog.value = stepsCount;
  } else {
    stats.stepLogs.push({ date: today, value: stepsCount });
  }
  saveStats(stats);
  return stats;
}

// Add a workout to history
export function logWorkout(exerciseName: string, duration: number, calories: number): UserStats {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  stats.workoutHistory.push({
    date: today,
    exerciseName,
    duration,
    calories
  });
  saveStats(stats);
  return stats;
}

// Toggle favorites
export function toggleFavorite(exerciseId: string): boolean {
  const stats = getStats();
  const index = stats.favorites.indexOf(exerciseId);
  let isFavorite = false;
  if (index > -1) {
    stats.favorites.splice(index, 1);
  } else {
    stats.favorites.push(exerciseId);
    isFavorite = true;
  }
  saveStats(stats);
  return isFavorite;
}

export function isSubscribed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('fitlife_subscribed') === 'true';
}

export function setSubscriptionStatus(status: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fitlife_subscribed', status ? 'true' : 'false');
}

const EXERCISES_KEY = 'fitlife_custom_exercises';

export function getExercises(): Exercise[] {
  if (typeof window === 'undefined') return SEEDED_EXERCISES;
  try {
    const data = localStorage.getItem(EXERCISES_KEY);
    if (!data) return SEEDED_EXERCISES;
    const customs = JSON.parse(data) as Exercise[];
    // Merge custom exercises with seeded ones (avoiding duplicates by id)
    const all = [...customs];
    SEEDED_EXERCISES.forEach(se => {
      if (!all.some(e => e.id === se.id)) {
        all.push(se);
      }
    });
    return all;
  } catch {
    return SEEDED_EXERCISES;
  }
}

export function saveCustomExercises(customs: Exercise[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(customs));
  } catch (e) {
    console.error('Failed to save custom exercises', e);
  }
}
