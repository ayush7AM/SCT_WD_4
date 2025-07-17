let todos = [];
        let nextId = 1;

        // Create floating particles
        function createParticles() {
            const particles = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particles.appendChild(particle);
            }
        }

        // Guilt messages for incomplete tasks
        const guiltMessages = [
            {
                title: "Task Abandoned",
                message: "You created this task with purpose, with hope. Now it joins the graveyard of your abandoned dreams. Each unfinished task is a promise you broke to yourself."
            },
            {
                title: "Another Failure",
                message: "While others achieved their goals, you gave up. This task believed in you, but you couldn't even finish what you started. How many more will you disappoint?"
            },
            {
                title: "Procrastination Victory",
                message: "Congratulations, you've let procrastination win again. This task could have been the stepping stone to something greater. Now it's just another regret."
            },
            {
                title: "Broken Promise",
                message: "You promised yourself you'd complete this. But promises to yourself don't matter, do they? You've become someone who can't even trust their own word."
            },
            {
                title: "Wasted Potential",
                message: "Every incomplete task represents wasted potential. You had the chance to grow, to achieve, to become better. Instead, you chose the easy path of giving up."
            },
            {
                title: "The Weight of Undone",
                message: "This task will haunt you. In quiet moments, you'll remember what you didn't do. The person you could have been if only you had the strength to finish."
            }
        ];

        function showGuiltMessage() {
            const randomMessage = guiltMessages[Math.floor(Math.random() * guiltMessages.length)];
            
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            
            const guiltDiv = document.createElement('div');
            guiltDiv.className = 'guilt-message';
            guiltDiv.innerHTML = `
                <h3>${randomMessage.title}</h3>
                <p>${randomMessage.message}</p>
                <button class="guilt-close" onclick="closeGuiltMessage()">I'll do better...</button>
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(guiltDiv);
            
            // Auto close after 5 seconds
            setTimeout(() => {
                closeGuiltMessage();
            }, 10000);
        }

        function closeGuiltMessage() {
            const overlay = document.querySelector('.overlay');
            const guiltMessage = document.querySelector('.guilt-message');
            if (overlay) overlay.remove();
            if (guiltMessage) guiltMessage.remove();
        }

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') return;
            
            const todo = {
                id: nextId++,
                text: text,
                completed: false,
                createdAt: new Date(),
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            };
            
            todos.push(todo);
            input.value = '';
            renderTodos();
            updateStats();
            
            // Check for overdue tasks every minute
            setTimeout(() => checkOverdueTasks(), 60000);
        }

        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
                updateStats();
            }
        }

        function deleteTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo && !todo.completed) {
                showGuiltMessage();
            }
            todos = todos.filter(t => t.id !== id);
            renderTodos();
            updateStats();
        }

        function checkOverdueTasks() {
            const now = new Date();
            todos.forEach(todo => {
                if (!todo.completed && now > todo.deadline) {
                    todo.overdue = true;
                }
            });
            renderTodos();
            updateStats();
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            
            if (todos.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <h3>No tasks yet</h3>
                        <p>Add your first task to get started</p>
                    </div>
                `;
                return;
            }
            
            todoList.innerHTML = todos.map(todo => {
                const timeDiff = todo.deadline - new Date();
                const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
                
                return `
                    <li class="todo-item ${todo.completed ? 'completed' : ''} ${todo.overdue ? 'overdue' : ''}">
                        <div class="todo-content">
                            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                            <div>
                                <div class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</div>
                                <div class="todo-time">
                                    ${todo.completed ? 'Completed' : 
                                      todo.overdue ? 'OVERDUE!' : 
                                      hoursLeft > 0 ? `${hoursLeft}h left` : 'Due soon'}
                                </div>
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button class="delete-btn" onclick="deleteTodo(${todo.id})">DELETE</button>
                        </div>
                    </li>
                `;
            }).join('');
        }

        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(t => t.completed).length;
            const overdue = todos.filter(t => t.overdue && !t.completed).length;
            
            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('overdueTasks').textContent = overdue;
        }

        // Add todo on Enter key
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Initialize
        createParticles();
        renderTodos();
        updateStats();
        
        // Check for overdue tasks every minute
        setInterval(checkOverdueTasks, 60000);