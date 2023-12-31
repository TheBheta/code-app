
//Box(target, encrypted, id, wordID)
let ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


export class Box {
    constructor(encrypted, id, wordID, cryptogram, hidden) {
        this.encrypted = encrypted;
        this.id = id;
        this.wordID = wordID;
        this.cryptogram = cryptogram;
        this.editValue = this.editValue.bind(this);
        this.highlight = this.highlight.bind(this);
        this.hidden = hidden;
    }

    editValue() {
        $("#input-" + this.id).val($("#input-" + this.id).val().toUpperCase().slice(-1));
        this.cryptogram.focusNextEmpty();
        //this.cryptogram.setAll(this.encrypted, $("#input-" + this.id).val().toUpperCase().slice(-1))
    }

    highlight() {
        //this.cryptogram.highlightAll(this.encrypted);
    }
    
    display() {
        $("#word-" + this.wordID).append(
            '<div class = "box" id="letter-' + this.id + '"></div>'
        );
        $("#letter-" + this.id).append(
            '<h3 class = "cryptogram-encrypted" id="encrypted-' + this.id + '">' + this.encrypted + '</h3>'
        );
        if (this.encrypted.toUpperCase() != this.encrypted.toLowerCase()) {
        $("#letter-" + this.id).append(
            '<input class = "cryptogram-input" id="input-' + this.id + '">'
        );
        } else {
            $("#letter-" + this.id).append(
                '<input readonly value = "' + this.encrypted + '"class = "cryptogram-input" id="input-' + this.id + '">'
            );
        }
        $("#input-" + this.id).on("input", this.editValue);
        $("#input-" + this.id).on("focus", this.highlight);
        if (this.hidden) {
            $("#input-" + this.id).hide();
        }
    }

}

export class MatrixBox extends Box {
    constructor(id, cryptogram) {
        super(null, id, null, cryptogram, false)
    }

    display() {
        $("#replacement-" + this.id).append(
            '<div class = "box" id="replacement-letter-' + this.id + '"></div>'
        );
        $("#replacement-letter-" + this.id).append(
            '<input class = "cryptogram-input" id="replacement-letter-input-' + this.id + '">'
        );
        
        $("#replacement-letter-input-" + this.id).on("input", this.editValue);
        $("#replacement-letter-input-" + this.id).on("focus", this.highlight);
        if (this.hidden) {
            $("#input-" + this.id).hide();
        }
    }

    
    editValue() {
        this.cryptogram.focusNextEmpty();
    }
}

//Word([boxes])
export class Word {
    constructor(letters, id, c) {
        this.letters = letters;
        this.id = id;
        this.c = c;
    }

    display() {
        console.log("displaying now");
        $("#cryptogram").append(
            '<div class="word" id="word-' + this.id + '"></div>'
        );
        for (let x = 0; x < this.letters.length; x++) {
            this.letters[x].display();
        }
    }
}
//TODO: refactor this to be Puzzle and make aristos and stuff extend it
export class Cryptogram {
    constructor(ciphertext, puzzle_id, alphabet, matrix) {
        this.ciphertext = ciphertext.toUpperCase();
        this.puzzle_id = puzzle_id;
        this.alphabet = alphabet;
        this.matrix = matrix;
        this.word;
        this.boxes = [];
        this.matrixBoxes = [];


        this.updateTime = this.updateTime.bind(this);
        this.time = Date.now();
        this.startTime = Date.now();
        this.updateTimeID = window.setInterval(this.updateTime, 33);
        this.generateTiles();
        this.generateMatrix()
        this.focusNextEmpty();
        //show timer
        $("#cryptogram").append("<div id='timer'></div>");;
    }


    generateTiles() {
        $("#cryptogram").empty();
        let boxID = 0;
        this.word = new Word([], 0, this);
        for (let l = 0; l < this.ciphertext.length; l++) {
            let b = new Box(this.ciphertext[l], boxID, 0, this, false);
            this.word.letters.push(b);
            this.boxes.push(b);
            boxID++;
        }

        this.word.display();

        

    }

    generateMatrix() {
        //create frequency table
        $("#cryptogram").append("<table id='matrix'></table>");
        $("#matrix").append("<tr id = 'encode-matrix'></tr>");
        $("#encode-matrix").append("<th>Encoding Matrix</th>");
        for (var row = 0; row < this.matrix.length; row++) {
            $("#encode-matrix").append(`<tr id='encode-matrix-row-${row}'></tr>`)
            for (var col = 0; col  < this.matrix[row].length; col++) {
                $(`#encode-matrix-row-${row}`).append(`<td><b>${this.matrix[row][col]}</b></td>`)
            }
        }
        $("#matrix").append("<tr id = 'decode-matrix'></tr>");
        $("#decode-matrix").append("<th>Decoding Matrix</th>");
        var size = this.matrix.length;
        for (var row = 0; row < this.matrix.length; row++) {
            $("#decode-matrix").append(`<tr id='decode-matrix-row-${row}'></tr>`)
            for (var col = 0; col  < this.matrix[row].length; col++) {
                let b = new MatrixBox((row * size + col), this);
                $(`#decode-matrix-row-${row}`).append("<td id = 'replacement-" + (row * size + col) + "'></td>")
                $("#replacement-" + (row * size + col)).append(b);
                this.matrixBoxes.push(b);
                b.display();
            }
        }
       
    }

    highlightAll(encrypted) {
        console.log("highlight all " + encrypted);
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].encrypted == encrypted)
                $("#input-" + this.boxes[i].id).addClass("highlighted");
            else 
                $("#input-" + this.boxes[i].id).removeClass("highlighted");
        }
        for (let i = 0; i < this.frequencyTableBoxes.length; i++) {
            if (this.frequencyTableBoxes[i].encrypted == encrypted)
                $("#replacement-letter-input-" + this.frequencyTableBoxes[i].id).addClass("highlighted");
            else 
                $("#replacement-letter-input-" + this.frequencyTableBoxes[i].id).removeClass("highlighted");
        }
    }

    focusNextEmpty() {
        let start = 0;
        if (document.activeElement.id.substring(0, 6) == "input-") {
            start = document.activeElement.id.substring(6);
        }
        let iterations = 0;
        for (let i = start; iterations < this.boxes.length; i++) {
            iterations++;
            if (i == this.boxes.length) 
                i = 0;
            if ($("#input-" + this.boxes[i].id).val() == "") {
                $("#input-" + this.boxes[i].id).focus();
                return;
            }
        }
    }

    updateTime() {
        this.time = (Date.now() - this.startTime)/1000;
        $("#timer").text("Time: " 
        + String(Math.floor(100 + Math.floor(this.time/60))).slice(-2) +  
        ":" + String((100 + (this.time)%60).toFixed(3)).substring(1,));
    }

    checkAnswer() {
        let answer = ""
        for (let i = 0; i < this.boxes.length; i++) {
            answer += $("#input-" + i).val();
        }
        console.log(answer);
        console.log(this.puzzle_id);
        $.ajax({
            url: 'check-puzzle',
            type: 'GET',
            data: {
                puzzle_id: encodeURIComponent(this.puzzle_id),
                answer: encodeURIComponent(answer),
                time_solved: encodeURIComponent(this.time)
            },
            success: function(response) {
                response = JSON.parse(response)
                if (response.solved === false) {
                    alert("Your response is incorrect. Keep trying, buddy.");
                } else if (response.solved === true) {
                    console.log("tryna clear interval")
                    window.clearInterval(this.updateTimeID);
                    alert("Congratulations! You solved this puzzle in " + response.time_solved + " seconds! That's worse than 98% of users!")
                    
                }
            },
            error: function(error) {
              console.log('Error:', error.responseText);
            }
          });
    }

    reset() {
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].hidden == false && this.alphabet.includes(this.boxes[i].encrypted))
                $("#input-" + i).val("");
        }
        for (let i = 0; i < this.matrixBoxes.length; i++) {
            if (this.matrixBoxes[i].hidden == false && this.alphabet.includes(this.boxes[i].encrypted))
                $("#replacement-letter-input-" + i).val("");
        }
        this.focusNextEmpty();
    }
}


