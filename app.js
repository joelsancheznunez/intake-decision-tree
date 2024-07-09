const questions = {

    georgia: {
        text: "Is the person a national from Georgia?",
        yes: "detained",
        no: "oneEntryNonGeorgia"
    },

    detained: {
        text: "Is the person detained in the State of Louisiana? Specifically in one of these following centers: Winn Correctional, Jackson Parish or River Correctional?",
        yes: "oneEntry",
        no: "accept"
    },

    oneEntry: {
        text: "Is this the first and only entry to the U.S?",
        yes: "hearingDate",
        no: "reject"
    },

    oneEntryNonGeorgia: {
        text: "For this NON-Georgia Citizen. Is this the first and only entry to the U.S?",
        yes: "fearInterview",
        no: "consultGrace"
    },

    hearingDate: {
        text: "Is the hearing court at least 4 weeks ahead?",
        yes: "criminalRecords",
        no: "reject"
    },

    criminalRecords: {
        text: "Does the person have any criminal records?",
        yes: "reject",
        no: "fearInterview"
    },

    fearInterview: {
        text: "What is the result of the Fear Interview?",
        options: ["POSITIVE", "Not Conducted yet", "NEGATIVE"],
        positive: "accept",
        notConducted: "accept",
        negative: "rejectFearInterview"
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
            html += `<button class="btn btn-outline-info btn me-2" onclick="handleAnswer('${questionId}', '${action}')">${option}</button>`;
        });
    } else {
        html += `
            <button class="btn btn-outline-success btn me-2" onclick="handleAnswer('${questionId}', 'yes')">YES</button>
            <button class="btn btn-outline-danger btn me-2" onclick="handleAnswer('${questionId}', 'no')">NO</button>
        `;
    }

    html += `
            </div>
            <br>
            <hr>
            <button class="btn btn-outline-primary btn-lg mt-3" onclick="resetTree()">Start Over</button>
        </div>
    `;

    document.getElementById('decisionTree').innerHTML = html;
}

function handleAnswer(questionId, answer) {
    const question = questions[questionId];
    let nextQuestionId;

    if (questionId === 'fearInterview') {
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
    } else if (nextQuestionId === 'rejectFearInterview') {
        showResult("Negative Fear Interview. Charge: $5,000.00 and advise the customer: There is only a 10% chance of reversing the decision. Due to the low likelihood of success, this fee is NON-refundable.");
    } else {
        nextQuestion(nextQuestionId);
    }
}

function showResult(message) {
    document.getElementById('decisionTree').innerHTML = '';
    document.getElementById('result').innerHTML = `
        <br>
        <div class="alert alert-info">
            <strong>Decision:</strong> ${message}
        </div>
        <br>
        <hr>
        <br>
        <button class="btn btn-outline-primary btn-lg" onclick="resetTree()">Start Over</button>
    `;
}

function resetTree() {
    document.getElementById('result').innerHTML = '';
    nextQuestion('georgia'); // Start the decision tree from the beginning (georgia question)
}

// Start the decision tree
nextQuestion('georgia');