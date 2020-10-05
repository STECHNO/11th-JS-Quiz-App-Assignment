function Question(question, opt1, opt2, opt3, opt4, ans) {
    this.question = question;
    this.opt1 = opt1;
    this.opt2 = opt2;
    this.opt3 = opt3;
    this.opt4 = opt4;
    this.ans = ans;
}

let question1 = new Question('What does HTML stand for?', 'a. Hyper Trainer Marking Language', 'b. Hyper Text Marketing Language', 'c. Hyper Text Markup Language', 'd. Hyper Text Markup Leveler', 'c. Hyper Text Markup Language')
let question2 = new Question('What dose this equation mean ? a != t', 'a. A is assigned t', 'b. A and t are equal', 'c. A is not equal to t', 'd. T is add to a', 'c. A is not equal to t')
let question3 = new Question('Inside which HTML element do we put the JavaScript?', "a. script", "b. javascript", "c. scripting", "d. js", "a. script")
let question4 = new Question('Which of the following type of variable takes precedence over other if names are same?', 'a. global variable', 'b. local variable', 'c. Both of the above', 'd. None of the above', 'b. local variable')
let question5 = new Question('Function of String object returns the character at the specified index?', 'a. charAt()', 'b. charCodeAt()', 'c. concat()', 'd. indexOf()', 'a. charAt()')




let allQuestions = {
    q1: question1,
    q2: question2,
    q3: question3,
    q4: question4,
    q5: question5
}

let key = 'allQuestions'
let checkInternetConnection = () => {
    firebase.database().ref(key).once('value', (data) => {
        if (data.val()) {
            // console.log('connected')
        } else {
            alert("Please Connect With Internet");
        }
    });
}

firebase.database().ref(key).set(allQuestions)

var count = 0
var quesSeries = 0
var remainingQuesCounter = 5

let startQuiz = () => {
    document.getElementById('startBtnDiv').innerHTML = ' '

    var spinner = document.createElement('div')
    spinner.setAttribute('class', 'loading')
    spinner.classList.add('spin');
    document.getElementById('startBtnDiv').appendChild(spinner)
    count++
    quesSeries++
    let getdata = new Promise((resolve, reject) => {
        firebase.database().ref(key).child('q' + quesSeries).once('value', (data) => {
            if (data.val()) {
                setTimeout(() => {
                    resolve(data.val())
                }, 300)
            }
            else {
                reject('Error Please Check Your Internet Connection.')
            }
        })
    })


    getdata.then((data) => {
        removeClass();
        document.getElementById('startBtnDiv').style.display = 'none'
        spinner.classList.remove('spin');
        var questionData = data
        document.getElementById('quesCount').innerHTML = count
        document.getElementById('remainingQuesCounter').innerHTML = remainingQuesCounter - count;
        document.getElementById('question').innerHTML = questionData.question
        document.getElementById('opt1').innerHTML = questionData.opt1
        document.getElementById('opt2').innerHTML = questionData.opt2
        document.getElementById('opt3').innerHTML = questionData.opt3
        document.getElementById('opt4').innerHTML = questionData.opt4
    })
        .catch((error) => {
            alert(error)
        })
}

let removeClass = () => {
    document.getElementById('showQuiz').classList.remove('hidden');
    document.getElementById('questionNum').classList.remove('qn');
    document.getElementById('remainingQues').classList.remove('qn');
}

var ansArr = [];
let ans = (getAns) => {
    ansArr = []
    ansArr = ansArr.splice(0, ansArr.length);
    ansArr.push(getAns.innerHTML);
}

let updateQues = () => {
    document.getElementById('startBtnDiv').innerHTML = ' ';
    document.getElementById('showQuiz').classList.add('hidden');
    document.getElementById('startBtnDiv').removeAttribute('style');
    var spinner = document.createElement('div');
    spinner.setAttribute('class', 'loading');
    spinner.classList.add('spin');
    document.getElementById('startBtnDiv').appendChild(spinner);
    count++;
    quesSeries++;

    let getdataP = new Promise((resolve, reject) => {
        firebase.database().ref(key).child('q' + quesSeries).once('value', (data) => {
            if (data.val()) {
                setTimeout(() => {
                    resolve(data.val())
                }, 300)
            }
            else {
                reject('Error Please Check Your Internet Connection.')
            }
        })
    })


    getdataP.then((data) => {
        document.getElementById('startBtnDiv').style.display = 'none'
        spinner.classList.remove('spin');
        document.getElementById('startBtnDiv').innerHTML = ' '
        document.getElementById('showQuiz').classList.remove('hidden');
        document.getElementById('quesCount').innerHTML = count
        document.getElementById('remainingQuesCounter').innerHTML = remainingQuesCounter - count;
        spinner.classList.remove('spin');
        document.getElementById('question').innerHTML = data.question
        document.getElementById('opt1').innerHTML = data.opt1
        document.getElementById('opt2').innerHTML = data.opt2
        document.getElementById('opt3').innerHTML = data.opt3
        document.getElementById('opt4').innerHTML = data.opt4
    })
        .catch((error) => {
            alert(error)
        })

}

userScore = 0;

let nextQues = (finish) => {

    firebase.database().ref(key).child('q' + quesSeries).once('value', (data) => {

        if (ansArr.length === 0) {
            swal("Please Choose Your Answer");
        }
        else if (ansArr[0] === data.val().ans) {
            userScore += 20;
            ansArr = [];
            updateQues();
        }
        else if (ansArr[0]) {
            ansArr = [];
            updateQues();
        }
        if (count === 5) {
            finish.innerHTML = 'Finish';
            finish.removeAttribute('onclick')
            finish.setAttribute('onClick', 'finish()')
        }
    })



}

let finish = () => {
    firebase.database().ref(key).child('q' + quesSeries).once('value', (data) => {
        if (ansArr.length === 0) {
            swal("Please Choose Your Answer");
        }
        else if (ansArr[0] === data.val().ans) {
            userScore += 20;
            ansArr = [];
        }
        else if (ansArr[0]) {
            ansArr = [];
        }
        document.getElementById('startBtnDiv').innerHTML = ' ';
        document.getElementById('showQuiz').classList.add('hidden');
        document.getElementById('startBtnDiv').removeAttribute('style')
        var spinner = document.createElement('div')
        spinner.setAttribute('class', 'loading')
        spinner.classList.add('spin');
        document.getElementById('startBtnDiv').appendChild(spinner);
        setTimeout(() => {
            document.getElementById('startBtnDiv').innerHTML = ' ';
            spinner.classList.remove('spin');
            var score = document.createElement('div')
            score.setAttribute('class', 'score')
            var scoreHead = document.createElement('h1')
            score.appendChild(scoreHead);
            scoreHead.innerHTML = 'Finish ' + '<br />' + 'You Scored ' + userScore + ' Out of 100';
            document.getElementById('startBtnDiv').appendChild(score);
            document.getElementById('totalQues').innerHTML = ' ';
            document.getElementById('remainingQues').innerHTML = ' ';
            document.getElementById('questionNum').innerHTML = ' ';
        }, 500)

    })
}
