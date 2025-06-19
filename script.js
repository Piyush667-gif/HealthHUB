// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Habit tracking
  const habitInput = document.getElementById("habit-input")
  const habitCategory = document.getElementById("habit-category")
  const addHabitBtn = document.getElementById("add-habit")
  const habitsContainer = document.querySelector(".habits-container")

  // Mindful minutes
  const startExerciseBtns = document.querySelectorAll(".start-exercise")
  const mindfulModal = document.getElementById("mindful-modal")
  const closeModal = document.querySelector(".close-modal")
  const stopExerciseBtn = document.getElementById("stop-exercise")
  const exerciseTitle = document.getElementById("exercise-title")
  const exerciseContent = document.getElementById("exercise-content")
  const minutesDisplay = document.getElementById("minutes")
  const secondsDisplay = document.getElementById("seconds")

  // Stats
  const streakValue = document.getElementById("streak-value")
  const completedValue = document.getElementById("completed-value")
  const mindfulValue = document.getElementById("mindful-value")

  // Animation for text elements
  const animateText = () => {
    const animatedElements = document.querySelectorAll(".animated-text")
    animatedElements.forEach((element) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(element)
    })
  }

  // Initialize animations
  animateText()

  // Local Storage API for data persistence
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const loadData = (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  // Initialize habits from local storage
  const habits = loadData("habits") || []
  const stats = loadData("stats") || {
    streak: 0,
    completed: 0,
    mindfulMinutes: 0,
  }

  // Update stats display
  const updateStats = () => {
    streakValue.textContent = stats.streak
    completedValue.textContent = stats.completed
    mindfulValue.textContent = stats.mindfulMinutes

    // Save stats to local storage
    saveData("stats", stats)
  }

  // Render habits
  const renderHabits = () => {
    habitsContainer.innerHTML = ""

    if (habits.length === 0) {
      habitsContainer.innerHTML = '<p class="no-habits">No habits added yet. Add your first habit above!</p>'
      return
    }

    habits.forEach((habit, index) => {
      const habitCard = document.createElement("div")
      habitCard.className = "habit-card fade-in"
      habitCard.style.animationDelay = `${index * 0.1}s`

      const progress = Math.min(100, Math.round((habit.completed / habit.goal) * 100))

      habitCard.innerHTML = `
                <h3>${habit.name} <span class="delete-habit" data-id="${index}">&times;</span></h3>
                <span class="category ${habit.category}">${habit.category}</span>
                <p class="streak">Current streak: ${habit.streak} days</p>
                <div class="progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <p>${habit.completed}/${habit.goal} completed today</p>
                <div class="actions">
                    <button class="complete-habit" data-id="${index}">
                        <i class="fas fa-check"></i> Complete
                    </button>
                    <button class="reset-habit" data-id="${index}">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
            `

      habitsContainer.appendChild(habitCard)
    })

    // Add event listeners to the newly created buttons
    document.querySelectorAll(".complete-habit").forEach((button) => {
      button.addEventListener("click", completeHabit)
    })

    document.querySelectorAll(".reset-habit").forEach((button) => {
      button.addEventListener("click", resetHabit)
    })

    document.querySelectorAll(".delete-habit").forEach((button) => {
      button.addEventListener("click", deleteHabit)
    })
  }

  // Add new habit
  const addHabit = () => {
    const name = habitInput.value.trim()
    const category = habitCategory.value

    if (name === "") {
      alert("Please enter a habit name")
      return
    }

    const newHabit = {
      name,
      category,
      streak: 0,
      completed: 0,
      goal: 1,
      lastCompleted: null,
    }

    habits.push(newHabit)
    saveData("habits", habits)

    habitInput.value = ""
    renderHabits()
  }

  // Complete habit
  const completeHabit = (e) => {
    const id = e.currentTarget.dataset.id
    const habit = habits[id]

    habit.completed++

    if (habit.completed >= habit.goal) {
      const today = new Date().toDateString()

      if (habit.lastCompleted !== today) {
        habit.streak++
        stats.streak++
        stats.completed++
        habit.lastCompleted = today
      }
    }

    saveData("habits", habits)
    updateStats()
    renderHabits()
  }

  // Reset habit
  const resetHabit = (e) => {
    const id = e.currentTarget.dataset.id
    const habit = habits[id]

    habit.completed = 0
    saveData("habits", habits)
    renderHabits()
  }

  // Delete habit
  const deleteHabit = (e) => {
    const id = e.currentTarget.dataset.id

    if (confirm("Are you sure you want to delete this habit?")) {
      habits.splice(id, 1)
      saveData("habits", habits)
      renderHabits()
    }
  }

  // Mindful minutes exercises
  const exercises = {
    breathing: {
      title: "Breathing Exercise",
      content: `
                <p>Follow these simple steps:</p>
                <ol>
                    <li>Sit comfortably with your back straight</li>
                    <li>Breathe in slowly through your nose for 4 seconds</li>
                    <li>Hold your breath for 7 seconds</li>
                    <li>Exhale slowly through your mouth for 8 seconds</li>
                    <li>Repeat the cycle</li>
                </ol>
                <div class="breathing-guide">
                    <div class="breathing-circle"></div>
                    <p class="breathing-instruction">Breathe in...</p>
                </div>
            `,
    },
    bodyscan: {
      title: "Body Scan Meditation",
      content: `
                <p>Follow these instructions:</p>
                <ol>
                    <li>Lie down or sit comfortably</li>
                    <li>Close your eyes and take a few deep breaths</li>
                    <li>Bring awareness to your feet, noticing any sensations</li>
                    <li>Slowly move your attention up through your legs, torso, arms, and head</li>
                    <li>Notice any areas of tension and try to release them</li>
                    <li>When your mind wanders, gently bring it back to the body part you're focusing on</li>
                </ol>
            `,
    },
    gratitude: {
      title: "Gratitude Practice",
      content: `
                <p>Take a few minutes to reflect on what you're grateful for:</p>
                <ol>
                    <li>Close your eyes and take a few deep breaths</li>
                    <li>Think of 3 things you're grateful for today</li>
                    <li>For each one, spend a moment really feeling the gratitude</li>
                    <li>Notice how this feeling affects your body and mind</li>
                </ol>
                <textarea id="gratitude-journal" placeholder="Write what you're grateful for here..." rows="5"></textarea>
            `,
    },
  }

  // Timer variables
  let timerInterval
  let seconds = 0

  // Start exercise
  const startExercise = (e) => {
    const exerciseType = e.currentTarget.dataset.exercise
    const exercise = exercises[exerciseType]

    exerciseTitle.textContent = exercise.title
    exerciseContent.innerHTML = exercise.content

    // Reset and start timer
    seconds = 0
    updateTimer()

    // Start timer
    timerInterval = setInterval(() => {
      seconds++
      updateTimer()

      // Special handling for breathing exercise
      if (exerciseType === "breathing") {
        const breathingInstruction = document.querySelector(".breathing-instruction")
        const breathingCircle = document.querySelector(".breathing-circle")

        const totalCycle = 19 // 4 + 7 + 8 seconds
        const currentPhase = seconds % totalCycle

        if (currentPhase < 4) {
          breathingInstruction.textContent = "Breathe in..."
          breathingCircle.style.animation = "expand 4s forwards"
        } else if (currentPhase < 11) {
          breathingInstruction.textContent = "Hold..."
          breathingCircle.style.animation = "none"
        } else {
          breathingInstruction.textContent = "Breathe out..."
          breathingCircle.style.animation = "contract 8s forwards"
        }
      }
    }, 1000)

    mindfulModal.style.display = "flex"
  }

  // Update timer display
  const updateTimer = () => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    minutesDisplay.textContent = mins.toString().padStart(2, "0")
    secondsDisplay.textContent = secs.toString().padStart(2, "0")
  }

  // Stop exercise
  const stopExercise = () => {
    clearInterval(timerInterval)

    // Update mindful minutes stats
    const minutesSpent = Math.ceil(seconds / 60)
    stats.mindfulMinutes += minutesSpent
    updateStats()

    mindfulModal.style.display = "none"
  }

  // Close modal
  const closeModalHandler = () => {
    stopExercise()
  }

  // Theme toggle
  const toggleTheme = () => {
    body.classList.toggle("light-theme")

    if (body.classList.contains("light-theme")) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      document.documentElement.style.setProperty("--dark-bg", "#f5f5f5")
      document.documentElement.style.setProperty("--dark-surface", "#ffffff")
      document.documentElement.style.setProperty("--light-text", "#333333")
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      document.documentElement.style.setProperty("--dark-bg", "#121212")
      document.documentElement.style.setProperty("--dark-surface", "#1e1e1e")
      document.documentElement.style.setProperty("--light-text", "#f5f5f5")
    }
  }

  // Check for new day and reset daily progress
  const checkNewDay = () => {
    const lastCheck = loadData("lastCheck")
    const today = new Date().toDateString()

    if (lastCheck !== today) {
      habits.forEach((habit) => {
        habit.completed = 0
      })

      saveData("habits", habits)
      saveData("lastCheck", today)
    }
  }

  // Initialize charts using Canvas API
  const initCharts = () => {
    // Weekly streak chart
    const streakChart = document.getElementById("streak-chart")
    const streakCtx = streakChart.getContext("2d")

    // Sample data - in a real app, this would come from the user's history
    const streakData = [3, 5, 7, 4, 6, 8, stats.streak]

    drawBarChart(streakCtx, streakData, "#6c63ff")

    // Completed habits chart
    const completedChart = document.getElementById("completed-chart")
    const completedCtx = completedChart.getContext("2d")

    // Sample data
    const completedData = [5, 8, 12, 10, 15, 9, stats.completed]

    drawBarChart(completedCtx, completedData, "#4caf50")

    // Mindful minutes chart
    const mindfulChart = document.getElementById("mindful-chart")
    const mindfulCtx = mindfulChart.getContext("2d")

    // Sample data
    const mindfulData = [10, 15, 5, 20, 10, 15, stats.mindfulMinutes]

    drawBarChart(mindfulCtx, mindfulData, "#ff7eb3")
  }

  // Draw bar chart
  const drawBarChart = (ctx, data, color) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const barWidth = width / data.length - 4

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Find max value for scaling
    const maxValue = Math.max(...data)

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 20)
      const x = index * (barWidth + 4) + 2
      const y = height - barHeight - 2

      // Draw bar
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw bar value
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value, x + barWidth / 2, y - 5)
    })
  }

  // Event listeners
  addHabitBtn.addEventListener("click", addHabit)

  startExerciseBtns.forEach((btn) => {
    btn.addEventListener("click", startExercise)
  })

  closeModal.addEventListener("click", closeModalHandler)
  stopExerciseBtn.addEventListener("click", stopExercise)

  themeToggle.addEventListener("click", toggleTheme)

  // Initialize
  checkNewDay()
  renderHabits()
  updateStats()

  // Initialize charts after a short delay to ensure the DOM is fully loaded
  setTimeout(() => {
    initCharts()
  }, 500)

  // Create canvas elements for charts
  const createChartCanvases = () => {
    const streakChart = document.getElementById("streak-chart")
    const completedChart = document.getElementById("completed-chart")
    const mindfulChart = document.getElementById("mindful-chart")
    ;[streakChart, completedChart, mindfulChart].forEach((container) => {
      const canvas = document.createElement("canvas")
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      container.appendChild(canvas)
    })
  }

  createChartCanvases()

  // Fetch a random health tip from an external API
  const fetchHealthTip = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random?tags=health")
      const data = await response.json()

      // Create a tip element
      const tipElement = document.createElement("div")
      tipElement.className = "health-tip"
      tipElement.innerHTML = `
                <h3>Daily Health Tip</h3>
                <p>"${data.content}"</p>
                <small>— ${data.author}</small>
            `

      // Add to the page
      const heroSection = document.querySelector(".hero")
      heroSection.appendChild(tipElement)
    } catch (error) {
      console.error("Error fetching health tip:", error)
    }
  }

  // Fetch health tip
  fetchHealthTip()

  // Add CSS for the health tip
  const addHealthTipStyles = () => {
    const style = document.createElement("style")
    style.textContent = `
            .health-tip {
                margin-top: 2rem;
                padding: 1.5rem;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                border-left: 4px solid var(--accent-color);
                animation: fadeIn 0.5s ease forwards;
                animation-delay: 1s;
                opacity: 0;
            }
            
            .health-tip h3 {
                color: var(--accent-color);
                margin-bottom: 0.5rem;
            }
            
            .health-tip p {
                font-style: italic;
                margin-bottom: 0.5rem;
            }
            
            .health-tip small {
                display: block;
                text-align: right;
                opacity: 0.7;
            }
            
            @keyframes expand {
                from { transform: scale(0.8); background-color: rgba(108, 99, 255, 0.2); }
                to { transform: scale(1.2); background-color: rgba(108, 99, 255, 0.5); }
            }
            
            @keyframes contract {
                from { transform: scale(1.2); background-color: rgba(108, 99, 255, 0.5); }
                to { transform: scale(0.8); background-color: rgba(108, 99, 255, 0.2); }
            }
            
            .breathing-guide {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 2rem 0;
            }
            
            .breathing-circle {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background-color: rgba(108, 99, 255, 0.3);
                margin-bottom: 1rem;
            }
            
            .breathing-instruction {
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            #gratitude-journal {
                width: 100%;
                padding: 1rem;
                margin-top: 1rem;
                background-color: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 8px;
                color: var(--light-text);
                resize: none;
            }
        `

    document.head.appendChild(style)
  }

  addHealthTipStyles()

  // Handle window resize for responsive charts(help user)
  window.addEventListener("resize", () => {
    // Redraw charts on window resize(making for attractive purpose)
    setTimeout(() => {
      initCharts()
    }, 100)
  })
})