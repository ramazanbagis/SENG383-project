/**
 * ISO 15939 Quality Measurement Platform
 * Logic Layer
 * * Handles simulation steps, metric calculations, and chart rendering.
 */

// Predefined Scenarios
const predefinedScenarios = {
    ecommerce: {
        name: 'E-Commerce Platform',
        type: 'web',
        infoNeed: 'Assess the overall quality of our e-commerce platform to ensure it meets customer expectations for performance, security, and usability during peak shopping seasons.',
        objective: 'Determine if system upgrades are needed before Black Friday and identify areas requiring immediate improvement to reduce cart abandonment rates.',
        recommendedDimensions: ['performance', 'security', 'usability', 'reliability']
    },
    studentportal: {
        name: 'Student Information Portal',
        type: 'web',
        infoNeed: 'Evaluate the student portal\'s effectiveness in supporting academic activities and determine if it provides adequate functionality and accessibility for students and faculty.',
        objective: 'Decide whether to invest in portal modernization and prioritize feature enhancements based on quality gaps.',
        recommendedDimensions: ['functional', 'usability', 'reliability', 'compatibility']
    },
    banking: {
        name: 'Mobile Banking Application',
        type: 'mobile',
        infoNeed: 'Measure the security, reliability, and user experience of our mobile banking app to ensure it meets regulatory standards and customer trust requirements.',
        objective: 'Validate app readiness for public launch and identify critical security or usability issues that could impact customer adoption.',
        recommendedDimensions: ['security', 'reliability', 'usability', 'performance']
    }
};

// Complete ISO 25010 Quality Model
const iso25010Model = {
    functional: {
        name: 'Functional Suitability',
        description: 'Completeness, correctness, appropriateness',
        subCharacteristics: ['Functional Completeness', 'Functional Correctness', 'Functional Appropriateness'],
        metrics: [
            { name: 'Functional Completeness', description: 'Function coverage', unit: '%', max: 100, target: 95 },
            { name: 'Functional Correctness', description: 'Correct outputs rate', unit: '%', max: 100, target: 98 },
            { name: 'Functional Appropriateness', description: 'Task achievement rate', unit: '%', max: 100, target: 90 }
        ]
    },
    // Diğer kalite özellikleri (Performance, Usability vb.) buraya gelir
    performance: {
        name: 'Performance Efficiency',
        description: 'Time behavior, resource utilization, capacity',
        subCharacteristics: ['Time Behaviour', 'Resource Utilization', 'Capacity'],
        metrics: [
            { name: 'Response Time', description: 'Average response time', unit: 'seconds', max: 5, inverse: true, target: 2 },
            { name: 'Throughput', description: 'Requests per second', unit: 'req/s', max: 1000, target: 500 },
            { name: 'CPU Utilization', description: 'Average CPU usage', unit: '%', max: 100, inverse: true, target: 70 }
        ]
    },
    compatibility: {
        name: 'Compatibility',
        description: 'Coexistence, interoperability',
        subCharacteristics: ['Co-existence', 'Interoperability'],
        metrics: [
            { name: 'Platform Coverage', description: 'Supported platforms', unit: '%', max: 100, target: 90 },
            { name: 'API Compatibility', description: 'Compatible interfaces', unit: '%', max: 100, target: 95 },
            { name: 'Integration Success', description: 'Successful integrations', unit: '%', max: 100, target: 98 }
        ]
    },
    usability: {
        name: 'Usability',
        description: 'User experience, learnability, operability',
        subCharacteristics: ['Learnability', 'Operability', 'User Error Protection', 'User Interface Aesthetics', 'Accessibility'],
        metrics: [
            { name: 'Task Success Rate', description: 'Tasks completed successfully', unit: '%', max: 100, target: 85 },
            { name: 'Task Completion Time', description: 'Average time to complete', unit: 'minutes', max: 10, inverse: true, target: 3 },
            { name: 'User Satisfaction', description: 'User satisfaction score', unit: '/10', max: 10, target: 8 }
        ]
    },
    reliability: {
        name: 'Reliability',
        description: 'Availability, fault tolerance, recoverability',
        subCharacteristics: ['Maturity', 'Availability', 'Fault Tolerance', 'Recoverability'],
        metrics: [
            { name: 'Availability', description: 'System uptime', unit: '%', max: 100, target: 99.9 },
            { name: 'Mean Time Between Failures', description: 'MTBF', unit: 'hours', max: 1000, target: 720 },
            { name: 'Recovery Time', description: 'Time to recover', unit: 'minutes', max: 60, inverse: true, target: 15 }
        ]
    },
    security: {
        name: 'Security',
        description: 'Confidentiality, integrity, authentication',
        subCharacteristics: ['Confidentiality', 'Integrity', 'Non-repudiation', 'Accountability', 'Authenticity'],
        metrics: [
            { name: 'Vulnerability Count', description: 'Security vulnerabilities', unit: 'count', max: 20, inverse: true, target: 0 },
            { name: 'Authentication Success', description: 'Successful authentications', unit: '%', max: 100, target: 99 },
            { name: 'Data Encryption Coverage', description: 'Encrypted data', unit: '%', max: 100, target: 100 }
        ]
    },
    maintainability: {
        name: 'Maintainability',
        description: 'Modularity, reusability, analyzability',
        subCharacteristics: ['Modularity', 'Reusability', 'Analysability', 'Modifiability', 'Testability'],
        metrics: [
            { name: 'Code Coverage', description: 'Test code coverage', unit: '%', max: 100, target: 80 },
            { name: 'Cyclomatic Complexity', description: 'Average complexity', unit: 'score', max: 20, inverse: true, target: 10 },
            { name: 'Documentation Coverage', description: 'Documented code', unit: '%', max: 100, target: 90 }
        ]
    },
    portability: {
        name: 'Portability',
        description: 'Adaptability, installability, replaceability',
        subCharacteristics: ['Adaptability', 'Installability', 'Replaceability'],
        metrics: [
            { name: 'Environment Coverage', description: 'Supported environments', unit: '%', max: 100, target: 85 },
            { name: 'Installation Success Rate', description: 'Successful installs', unit: '%', max: 100, target: 95 },
            { name: 'Migration Effort', description: 'Time to migrate', unit: 'hours', max: 100, inverse: true, target: 20 }
        ]
    }
};

// BÖLÜM 2: DURUM YÖNETİMİ (STATE MANAGEMENT)
// Uygulamanın o anki durumunu tutan değişkenler

let currentStep = 1;
let selectedScenario = 'custom';
let selectedDimensions = [];
let selectedMetrics = {};
let measurementData = {};

// BÖLÜM 3: FONKSİYONLAR (FUNCTIONS)
// Sayfa ilk açıldığında çalışacak başlangıç fonksiyonu
function init() {
    renderDimensions();
}

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
}

// Scenario Selection
function selectScenario(scenarioType) {
    selectedScenario = scenarioType;
    
    // Update UI
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.scenario-card').classList.add('selected');

    const customForm = document.getElementById('customScenarioForm');
    
    if (scenarioType === 'custom') {
        customForm.style.display = 'block';
    } else {
        customForm.style.display = 'block';
        const scenario = predefinedScenarios[scenarioType];
        document.getElementById('projectName').value = scenario.name;
        document.getElementById('projectType').value = scenario.type;
        document.getElementById('infoNeed').value = scenario.infoNeed;
        document.getElementById('objective').value = scenario.objective;
    }
}

// Render Quality Dimensions
function renderDimensions() {
    const container = document.getElementById('dimensionsContainer');
    let html = '';

    Object.keys(iso25010Model).forEach(key => {
        const dim = iso25010Model[key];
        html += `
            <div class="dimension-card">
                <div class="dimension-header">
                    <label style="display: flex; align-items: center; gap: 12px; margin: 0;">
                        <input type="checkbox" class="dimension-check" data-dimension="${key}" onchange="updateWeights()">
                        <span class="dimension-name">${dim.name}</span>
                    </label>
                    <input type="number" class="weight-input" data-dimension="${key}" min="0" max="100" value="12" disabled onchange="validateWeights()">
                </div>
                <p style="color: var(--text-light); margin-top: 12px;">${dim.description}</p>
                
                <button class="expand-btn" onclick="toggleSubCharacteristics('${key}')">
                    Show Sub-characteristics ▼
                </button>
                
                <div class="sub-characteristics" id="sub-${key}">
                    ${dim.subCharacteristics.map(sub => `
                        <div class="sub-char-item">
                            <span style="color: var(--primary);">▸</span>
                            <span>${sub}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Toggle Sub-characteristics
function toggleSubCharacteristics(dimension) {
    const subDiv = document.getElementById(`sub-${dimension}`);
    const btn = event.target;
    
    if (subDiv.classList.contains('expanded')) {
        subDiv.classList.remove('expanded');
        btn.textContent = 'Show Sub-characteristics ▼';
    } else {
        subDiv.classList.add('expanded');
        btn.textContent = 'Hide Sub-characteristics ▲';
    }
}

// Update Weights
function updateWeights() {
    const checkboxes = document.querySelectorAll('.dimension-check');
    selectedDimensions = [];
    
    checkboxes.forEach(cb => {
        const input = document.querySelector(`.weight-input[data-dimension="${cb.dataset.dimension}"]`);
        if (cb.checked) {
            input.disabled = false;
            selectedDimensions.push({
                name: cb.dataset.dimension,
                weight: parseInt(input.value) || 0
            });
        } else {
            input.disabled = true;
        }
    });

    validateWeights();
}

// Validate Weights
function validateWeights() {
    const inputs = document.querySelectorAll('.weight-input:not([disabled])');
    let total = 0;
    
    inputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });

    document.getElementById('totalWeight').textContent = total;
    const validation = document.getElementById('weightValidation');
    const nextBtn = document.getElementById('planNextBtn');

    if (total === 100 && selectedDimensions.length > 0) {
        validation.innerHTML = '<span style="color: var(--success);">✓ Valid</span>';
        nextBtn.disabled = false;
    } else if (total > 100) {
        validation.innerHTML = '<span style="color: var(--danger);">⚠ Exceeds 100%</span>';
        nextBtn.disabled = true;
    } else {
        validation.innerHTML = '<span style="color: var(--warning);">⚠ Must total 100%</span>';
        nextBtn.disabled = true;
    }

    // Update selected dimensions weights
    selectedDimensions = [];
    inputs.forEach(input => {
        selectedDimensions.push({
            name: input.dataset.dimension,
            weight: parseInt(input.value) || 0
        });
    });
}

// Step Navigation
function nextStep() {
    if (currentStep === 1) {
        // Validate Step 1
        const projectName = document.getElementById('projectName').value;
        if (!projectName) {
            alert('Please enter a project name');
            return;
        }
    }

    if (currentStep === 2) {
        renderMetricSelection();
    }

    if (currentStep === 3) {
        calculateResults();
    }

    currentStep++;
    showSimStep(currentStep);
}

function prevStep() {
    currentStep--;
    showSimStep(currentStep);
}

function showSimStep(step) {
    // Update step indicator
    document.querySelectorAll('.step').forEach((s, idx) => {
        s.classList.remove('active', 'completed');
        const circle = s.querySelector('.step-circle');
        
        if (idx + 1 < step) {
            s.classList.add('completed');
            circle.textContent = '✓';
        } else if (idx + 1 === step) {
            s.classList.add('active');
            circle.textContent = idx + 1;
        } else {
            circle.textContent = idx + 1;
        }
    });

    // Show correct sim step
    document.querySelectorAll('.sim-step').forEach(s => {
        s.classList.remove('active');
    });
    document.querySelector(`.sim-step[data-step="${step}"]`).classList.add('active');
}

// Render Metric Selection
function renderMetricSelection() {
    const container = document.getElementById('metricsSelectionContainer');
    let html = '';

    selectedDimensions.forEach(dim => {
        const model = iso25010Model[dim.name];
        html += `
            <div class="metrics-selection">
                <h3 style="color: var(--dark); margin-bottom: 15px; font-size: 1.4em;">${model.name}</h3>
                <p style="color: var(--text-light); margin-bottom: 20px;">Select metrics from ISO 25023 or add custom metrics</p>
                
                <div class="metric-list">
                    ${model.metrics.map((metric, idx) => `
                        <div class="metric-option">
                            <input type="checkbox" id="metric-${dim.name}-${idx}" 
                                   data-dimension="${dim.name}" 
                                   data-index="${idx}"
                                   onchange="toggleMetric('${dim.name}', ${idx})" checked>
                            <div class="metric-details">
                                <strong>${metric.name}</strong>
                                <small>${metric.description} (${metric.unit}) - Target: ${metric.target}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="custom-metric-form">
                    <h4>➕ Add Custom Metric</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <input type="text" placeholder="Metric Name" id="custom-name-${dim.name}" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
                        <input type="text" placeholder="Unit (e.g., %, ms)" id="custom-unit-${dim.name}" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
                        <button class="btn btn-primary" style="padding: 10px;" onclick="addCustomMetric('${dim.name}')">Add Metric</button>
                    </div>
                </div>

                <div id="dataInputs-${dim.name}" style="margin-top: 30px;">
                    <h4 style="color: var(--dark); margin-bottom: 20px;">📊 Enter Measurement Values</h4>
                    <div class="metrics-grid" id="inputs-${dim.name}">
                        ${renderMetricInputs(dim.name, model.metrics)}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Initialize selected metrics
    selectedDimensions.forEach(dim => {
        selectedMetrics[dim.name] = iso25010Model[dim.name].metrics.map((m, idx) => ({
            ...m,
            selected: true,
            index: idx
        }));
    });
}

function renderMetricInputs(dimension, metrics) {
    return metrics.map((metric, idx) => `
        <div class="metric-item" id="input-${dimension}-${idx}">
            <div class="metric-name">${metric.name}</div>
            <div class="metric-desc">${metric.description}</div>
            <div class="metric-input-group">
                <input type="number" 
                       class="metric-input" 
                       id="${dimension}_${idx}"
                       placeholder="Enter value"
                       step="0.01">
                <span class="metric-unit">${metric.unit}</span>
            </div>
        </div>
    `).join('');
}

function toggleMetric(dimension, index) {
    const checkbox = document.getElementById(`metric-${dimension}-${index}`);
    const inputDiv = document.getElementById(`input-${dimension}-${index}`);
    
    if (inputDiv) {
        inputDiv.style.display = checkbox.checked ? 'block' : 'none';
    }
}

function addCustomMetric(dimension) {
    const nameInput = document.getElementById(`custom-name-${dimension}`);
    const unitInput = document.getElementById(`custom-unit-${dimension}`);
    
    if (!nameInput.value || !unitInput.value) {
        alert('Please fill in all custom metric fields');
        return;
    }

    const customMetric = {
        name: nameInput.value,
        description: 'Custom metric',
        unit: unitInput.value,
        max: 100,
        target: 80,
        custom: true
    };

    // Add to model
    iso25010Model[dimension].metrics.push(customMetric);
    
    // Re-render inputs
    const inputsContainer = document.getElementById(`inputs-${dimension}`);
    const newIndex = iso25010Model[dimension].metrics.length - 1;
    inputsContainer.innerHTML += renderMetricInputs(dimension, [customMetric]).replace(`${dimension}_${0}`, `${dimension}_${newIndex}`);
    
    // Clear form
    nameInput.value = '';
    unitInput.value = '';
    
    alert('Custom metric added successfully!');
}

// Calculate Results
function calculateResults() {
    const results = {};
    let weightedSum = 0;

    selectedDimensions.forEach(dim => {
        const model = iso25010Model[dim.name];
        let dimScore = 0;
        let count = 0;

        model.metrics.forEach((metric, idx) => {
            const input = document.getElementById(`${dim.name}_${idx}`);
            if (input && input.value && input.closest('.metric-item').style.display !== 'none') {
                let value = parseFloat(input.value);
                let normalized;
                
                if (metric.inverse) {
                    normalized = 100 - (value / metric.max * 100);
                } else {
                    normalized = (value / metric.max * 100);
                }
                
                dimScore += Math.max(0, Math.min(100, normalized));
                count++;
            }
        });

        if (count > 0) {
            results[dim.name] = {
                score: dimScore / count,
                weight: dim.weight
            };
            weightedSum += (dimScore / count) * (dim.weight / 100);
        }
    });

    displayResults(weightedSum, results);
}

// Display Results with Radar Chart
function displayResults(totalScore, dimensionScores) {
    const container = document.getElementById('resultsContainer');
    
    // Determine rating based on PDF thresholds
    let rating = '';
    let ratingColor = '';
    if (totalScore >= 80) {
        rating = 'Strong Quality';
        ratingColor = 'var(--success)';
    } else if (totalScore >= 60) {
        rating = 'Moderate Quality';
        ratingColor = 'var(--warning)';
    } else {
        rating = 'Weak - Needs Improvement';
        ratingColor = 'var(--danger)';
    }

    let html = `
        <div class="results-container">
            <div class="result-card">
                <h3 style="font-size: 1.3em; margin-bottom: 10px;">Overall Quality Index</h3>
                <div class="result-score">${totalScore.toFixed(1)}<span style="font-size: 0.4em;">/100</span></div>
                <div class="result-rating" style="color: ${ratingColor}">${rating}</div>
            </div>

            <div class="charts-grid">
                <div class="chart-box">
                    <h4 style="color: var(--dark); margin-bottom: 20px; font-size: 1.2em;">Radar Chart Analysis</h4>
                    <canvas id="radarChart"></canvas>
                </div>
                <div class="chart-box">
                    <h4 style="color: var(--dark); margin-bottom: 20px; font-size: 1.2em;">Dimension Scores</h4>
                    <canvas id="barChart"></canvas>
                </div>
            </div>

            <div class="chart-container" style="margin-top: 30px;">
                <div class="chart-title">Quality Dimensions Breakdown</div>
                <div style="margin-top: 25px;">
    `;

    Object.keys(dimensionScores).forEach(dim => {
        const data = dimensionScores[dim];
        const barWidth = data.score;
        let barColor = 'var(--success)';
        if (data.score < 60) barColor = 'var(--danger)';
        else if (data.score < 80) barColor = 'var(--warning)';

        html += `
            <div style="margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong style="color: var(--dark); font-size: 1.05em;">${iso25010Model[dim].name}</strong>
                    <span style="color: var(--text-light); font-weight: 600;">${data.score.toFixed(1)} / 100 (Weight: ${data.weight}%)</span>
                </div>
                <div style="background: var(--bg); height: 35px; border-radius: 20px; overflow: hidden;">
                    <div style="background: ${barColor}; height: 100%; width: ${barWidth}%; transition: width 0.6s;"></div>
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>

            <div class="gap-analysis">
                <div class="chart-title">⚠️ Areas for Improvement</div>
    `;

    const gaps = Object.keys(dimensionScores)
        .map(dim => ({
            name: dim,
            displayName: iso25010Model[dim].name,
            score: dimensionScores[dim].score,
            gap: 100 - dimensionScores[dim].score
        }))
        .filter(d => d.score < 80)
        .sort((a, b) => a.score - b.score);

    if (gaps.length === 0) {
        html += '<p style="color: var(--success); text-align: center; padding: 25px; font-weight: 700; font-size: 1.05em;">✓ No significant gaps found! All dimensions meet quality standards (≥80%).</p>';
    } else {
        gaps.forEach(gap => {
            const severity = gap.score < 60 ? 'critical' : 'moderate';
            html += `
                <div class="gap-item ${severity}">
                    <div>
                        <span style="font-weight: 800; color: var(--dark); font-size: 1.05em;">${gap.displayName}</span>
                        <span class="gap-badge ${severity}">${severity === 'critical' ? 'Weak' : 'Moderate'}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.6em; font-weight: 800; color: var(--dark);">${gap.score.toFixed(1)}</div>
                        <div style="font-size: 0.9em; color: var(--text-light); font-weight: 600;">Gap: ${gap.gap.toFixed(1)}</div>
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>

            <div class="recommendations">
                <div class="chart-title">💡 Recommendations</div>
    `;

    const projectType = document.getElementById('projectType').value;
    const recommendations = getRecommendations(gaps, projectType);
    
    recommendations.forEach((rec, idx) => {
        html += `
            <div class="recommendation-item">
                <div style="display: flex; gap: 18px;">
                    <div style="font-size: 1.6em; font-weight: 800; color: var(--success);">${idx + 1}.</div>
                    <div style="color: var(--text); line-height: 1.7;">${rec}</div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Render Charts
    renderRadarChart(dimensionScores);
    renderBarChart(dimensionScores);
}

function renderRadarChart(dimensionScores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    const labels = Object.keys(dimensionScores).map(key => iso25010Model[key].name);
    const data = Object.values(dimensionScores).map(d => d.score);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quality Score',
                data: data,
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderBarChart(dimensionScores) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    const labels = Object.keys(dimensionScores).map(key => iso25010Model[key].name);
    const data = Object.values(dimensionScores).map(d => d.score);
    
    // Color bars based on thresholds
    const backgroundColors = data.map(score => {
        if (score >= 80) return 'rgba(16, 185, 129, 0.8)';
        if (score >= 60) return 'rgba(245, 158, 11, 0.8)';
        return 'rgba(239, 68, 68, 0.8)';
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quality Score',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function getRecommendations(gaps, projectType) {
    const recommendations = [];

    gaps.forEach(gap => {
        switch(gap.name) {
            case 'functional':
                recommendations.push(`Enhance functional suitability: Conduct requirements review, implement missing features, and validate correctness through comprehensive testing.`);
                break;
            case 'performance':
                recommendations.push(`Optimize ${projectType} performance: Implement caching strategies, optimize database queries, and consider CDN for static assets.`);
                break;
            case 'usability':
                recommendations.push(`Enhance user experience: Conduct usability testing with real users, simplify navigation, and improve error messages and user guidance.`);
                break;
            case 'reliability':
                recommendations.push(`Improve system reliability: Implement comprehensive error handling, add health monitoring, establish backup systems, and increase test coverage.`);
                break;
            case 'security':
                recommendations.push(`Strengthen security measures: Conduct security audit, implement regular updates, enforce encryption, and add multi-factor authentication.`);
                break;
            case 'compatibility':
                recommendations.push(`Expand compatibility: Test across more platforms/browsers, follow web standards, ensure responsive design, and validate API integrations.`);
                break;
            case 'maintainability':
                recommendations.push(`Improve maintainability: Refactor complex code, increase documentation coverage, add automated tests, and establish coding standards.`);
                break;
            case 'portability':
                recommendations.push(`Enhance portability: Support multiple deployment environments, containerize application, and minimize platform-specific dependencies.`);
                break;
        }
    });

    if (recommendations.length === 0) {
        recommendations.push('Continue monitoring quality metrics regularly to maintain high standards.');
        recommendations.push('Consider optimizing further based on user feedback and usage patterns.');
        recommendations.push('Document best practices that led to these strong quality results for future projects.');
    }

    return recommendations;
}

function resetSimulator() {
    currentStep = 1;
    selectedDimensions = [];
    selectedMetrics = {};
    measurementData = {};
    
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active', 'completed');
        s.querySelector('.step-circle').textContent = s.dataset.step;
    });
    
    document.getElementById('projectName').value = '';
    document.getElementById('projectType').value = '';
    document.getElementById('infoNeed').value = '';
    document.getElementById('objective').value = '';
    
    document.querySelectorAll('.dimension-check').forEach(cb => cb.checked = false);
    updateWeights();
    
    showSimStep(1);
}

// Sayfa tamamen yüklendiğinde init fonksiyonunu başlat
window.onload = init;
// script.js EN ALTINA EKLE

function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    
    // Sınıfı aç/kapa
    body.classList.toggle('dark-mode');
    
    // İkonu ve durumu güncelle
    if (body.classList.contains('dark-mode')) {
        icon.textContent = '☀️'; // Güneş simgesi
        localStorage.setItem('theme', 'dark');
    } else {
        icon.textContent = '🌙'; // Ay simgesi
        localStorage.setItem('theme', 'light');
    }
}

// Sayfa yüklendiğinde hafızadaki tercihi kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if(icon) icon.textContent = '☀️';
    }
});
