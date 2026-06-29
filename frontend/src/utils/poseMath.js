/**
 * Calculate the angle between three points (A, B, C).
 * B is the vertex.
 * Each point should have x and y properties (e.g., from MediaPipe landmarks).
 */
export const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

/**
 * Determine if a point is above or below another point (y-axis in image coordinates, where 0 is top).
 */
export const isAbove = (pointA, pointB) => {
  return pointA.y < pointB.y;
};

/**
 * Assess squat form and count reps.
 * @param {Array} landmarks - MediaPipe pose landmarks
 * @param {Object} state - Current state of the exercise (reps, stage)
 * @returns {Object} Updated state and feedback message
 */
export const analyzeSquat = (landmarks, state) => {
  // MediaPipe landmarks indices:
  // 23: Left Hip, 25: Left Knee, 27: Left Ankle
  // 24: Right Hip, 26: Right Knee, 28: Right Ankle
  
  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  
  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return { ...state, feedback: "Please ensure full body is visible." };
  }

  // Calculate angles (using left side for simplicity, ideally average both sides)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  
  let { reps, stage } = state;
  let feedback = "Good form";
  
  // Basic squat logic
  if (leftKneeAngle > 160) {
    stage = "up";
  }
  
  if (leftKneeAngle < 90 && stage === "up") {
    stage = "down";
    reps += 1;
    feedback = "Great rep!";
  } else if (leftKneeAngle < 140 && leftKneeAngle >= 90) {
      feedback = "Go lower!";
  }

  return { reps, stage, feedback, angle: Math.round(leftKneeAngle) };
};

/**
 * Drawing utilities on canvas
 */
export const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = '#00ff88';
    landmarks.forEach(landmark => {
        const x = landmark.x * ctx.canvas.width;
        const y = landmark.y * ctx.canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
};

export const drawConnections = (ctx, landmarks) => {
    // MediaPipe pose connections mapping
    const connections = [
        // Torso
        [11, 12], [11, 23], [12, 24], [23, 24],
        // Arms
        [11, 13], [13, 15], [12, 14], [14, 16],
        // Legs
        [23, 25], [25, 27], [24, 26], [26, 28]
    ];

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;

    connections.forEach(([p1, p2]) => {
        if (landmarks[p1] && landmarks[p2]) {
            ctx.beginPath();
            ctx.moveTo(landmarks[p1].x * ctx.canvas.width, landmarks[p1].y * ctx.canvas.height);
            ctx.lineTo(landmarks[p2].x * ctx.canvas.width, landmarks[p2].y * ctx.canvas.height);
            ctx.stroke();
        }
    });
};
