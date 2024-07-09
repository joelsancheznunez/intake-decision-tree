const questions = {
    detained: {
        text: "Is the caller detained in the State of Louisiana?",
        yes: "georgia",
        no: "consultGrace"
    },
    georgia: {
        text: "Is the caller a national from Georgia?",
        yes: "oneEntry",
        no: "accept"
    },
    oneEntry: {
        text: "Is this the caller's only entry to the U.S?",
        yes: "hearingDate",
        no: "reject"
    },
    hearingDate: {
        text: "Is the hearing court at least 4 weeks ahead?",
        yes: "criminalRecords",
        no: "reject"
    },
    criminalRecords: {
        text: "Does the caller have any criminal records?",
        yes: "reject",
        no: "fearInterview"
    },
    fearInterview: {
        text: "What is the result of the Fear Interview?",
        options: ["POSITIVE", "Not Conducted yet", "NEGATIVE"],
        positive: "accept",
        notConducted: "accept",
        negative: "reject"
    }
};

function nextQuestion(questionId) {
    const question = questions[questionId];
    let html = `
        <div class="node">
            <h3>${question.text}</h3>
            <div class="options">
    `;

    if (question.options) {
        question.options.forEach(option => {
            const action = option.replace(/ /g, '').toLowerCase();
            html += `<h2 class="btn btn-outline-info btn me-2" onclick="handleAnswer('${questionId}', '${action}')">${option}</h2>`;
        });
    } else {
        html += `
            <button class="btn btn-outline-success btn me-2" onclick="handleAnswer('${questionId}', 'yes')">YES</button>
            <button class="btn btn-outline-danger btn me-2" onclick="handleAnswer('${questionId}', 'no')">NO</button>
        `;
    }

    html += `
            </div>
        </div>
    `;

    document.getElementById('decisionTree').innerHTML = html;
}

function handleAnswer(questionId, answer) {
    const question = questions[questionId];
    let nextQuestionId;

    if (questionId === 'fearInterview') {
        // Map the action back to the original option key
        if (answer === 'positive') {
            nextQuestionId = question.positive;
        } else if (answer === 'notconductedyet') {
            nextQuestionId = question.notConducted;
        } else if (answer === 'negative') {
            nextQuestionId = question.negative;
        }
    } else {
        nextQuestionId = answer === 'yes' ? question.yes : question.no;
    }

    if (nextQuestionId === 'accept') {
        showResult("Accept the case. Proceed with intake process and provide payment information to the client.");
    } else if (nextQuestionId === 'reject') {
        showResult("Reject the case. Do not proceed with intake.");
    } else if (nextQuestionId === 'consultGrace') {
        showResult("Consult with Attorney Grace for further guidance.");
    } else {
        nextQuestion(nextQuestionId);
    }
}

function showResult(message) {
    document.getElementById('decisionTree').innerHTML = '';
    document.getElementById('result').innerHTML = `
        <div class="alert alert-info">
            <strong>Decision:</strong> ${message}
        </div>
        <button class="btn btn-outline-primary" onclick="resetTree()">Start Over</button>
    `;
}

function resetTree() {
    document.getElementById('result').innerHTML = '';
    nextQuestion('detained');
}

// Start the decision tree
nextQuestion('detained');
