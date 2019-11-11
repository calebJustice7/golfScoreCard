class PlayerCollection {
    constructor() {
        this.collection = [];
    }
    add(name) {
        this.collection.push(new Player(name));
    }

}

class Player{
    constructor(name){
        this.scores = [];
        this.name = name;
    }
    returnScores() {
        return this.scores();
    }
    add(score) {
        this.scores.push(score)
    }
}

let pCollection = new PlayerCollection();