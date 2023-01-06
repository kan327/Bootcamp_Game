var player;
var background;
var lompat = true;
var rintangan = [];
var score = 0;

function cetak(text){
    return text
}

var arena = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");

        // mencetak element ke html
        document.getElementById("game").insertBefore(this.canvas, document.getElementById("game").childNodes[0]);

        this.interval = setInterval(updateGame , 20)

        window.addEventListener("keydown", function(event){
            arena.keys = arena.keys || []
            arena.keys[event.keyCode] = event.type == "keydown"
        })

        window.addEventListener("keyup", function(event){
            arena.keys[event.keyCode] = event.type == "keydown"
        })

        this.frameNo = 0
    },
    clear: function(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height)
    },
    stop: function(){
        clearInterval(this.interval)
    }

}


// konfigurasi player
function komponen(width, height, color, x, y, type){
    this.type = type
    if(type == "image" || type == "background"){
        this.image = new Image()
        this.image.src = color // memberikan gambar kepada objek
    }
    this.width = width
    this.height = height
    this.color =color
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0

    // menambahkan gravitasi
    this.gravity = 0.5
    this.speedGravity = 0

    this.update = function(){
        konteks = arena.context
        
        if(this.type == "text"){

        }

        if(type == "image" || type == "background"){

            // mencetak gambar
            konteks.drawImage(this.image, this.x, this.y,this.width, this.height)

        }else{

            // mencetak tanpa image
            konteks.fillStyle = color
            konteks.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    // mengubah posisi komponen
    this.newPosition = function(){
        this.speedGravity += this.gravity
        this.x += this.speedX
        this.y += this.speedY + this.speedGravity

        this.dead()

        // player menyentuh atap
        if(this.y <= 0){
            this.speedY = 0
            lompat = false
        }else if(this.y >= this.height + 10){
            this.speedY = 0
            lompat = true
        }


    }

    this.pipa = function(rintangan){
        // player
        var kiri = this.x
        var kanan = this.x + this.width
        var atas = this.y
        var bawah = this.y + this.height

        // rintangan
        var kiriRintangan = rintangan.x
        var kananRintangan = rintangan.x + rintangan.width
        var atasRintangan = rintangan.y
        var bawahRintangan = rintangan.y + rintangan.height

        var crash = true

        if(bawah < atasRintangan || atas > bawahRintangan || kanan < kiriRintangan || kiri > kananRintangan){
            crash = false
        }

        return crash
        
    }

    // kondisi jika player menginjak lantai
    this.dead = function (){
        var lantai = arena.canvas.height - this.height

        if(this.y >= lantai){
            arena.stop()
        }
    }
}

function everyInterval(n){
    if((arena.frameNo / n) % 1 == 0){
        return true
    }

    return false

}

function startGame(){
    arena.start()

    // membuat player
    player = new komponen(50, 50, "assets/img/birdfall.png", 50, arena.canvas.height / 2 - 30, "image")

    // menambahkan background
    background = new komponen(window.innerWidth, window.innerHeight, "assets/img/background.jpg", 0, 0, "background")

}

function updateGame(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for(i = 0; i < rintangan.length; i++){
        if(player.pipa(rintangan[i])){
            arena.stop()
        }
    }

    arena.clear()

    arena.frameNo += 1

    if(arena.frameNo == 1 || everyInterval(70)){
        x = arena.canvas.width
        minHeight = 50
        maxHeight = 150

        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)

        if(score >= 3){
            minGap = 100
            maxGap = 300
        }else{
            minGap = 400
            maxGap = 400
        }

        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)

        // rintangan atas
        rintangan.push(new komponen(30, height, "pink", x, 0 ))

        // rintangan bawah
        rintangan.push(new komponen(30,x - height - gap, "pink", x, height + gap ))

    }
    background.update() 
    
    // menggerakan, menampilkan rintangan
    for(i = 0; i < rintangan.length; i++){
        rintangan[i].x += -3
        rintangan[i].update()
    }
    if(arena.keys && arena.keys[32]){
        if(lompat){
            player.speedY = -10
            player.speedGravity = 0
        }
    }

    player.newPosition()
    player.update()
}
