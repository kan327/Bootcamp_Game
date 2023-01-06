// membuat sebuah variable
var player; // membuat variable saja tanpa mengisi data 
var background; // membuat variable saja tanpa mengisi data 
var lompat = true; // variable yang bertipe data boolean (true/false)
var rintangan = [];
var score = 0; // variable yang bertipe data integer atau int
var scorePlayer; // membuat variable saja tanpa mengisi data 
var jumlahScore = []; // variable yang bertipe data array

var arena = {
    canvas: document.createElement("canvas"), // membuat element ke dalam htm;
    start: function(){
        this.canvas.width = window.innerWidth; // mengatur supaya ukuran lebar canvas seusai ukuran layar
        this.canvas.height = window.innerHeight; // mengatur supaya ukuran tinggi canvas sesuai ukuran layar
        this.context = this.canvas.getContext("2d"); // membuat context di dalam canvas

        // mencetak element ke html
        document.getElementById("game").insertBefore(this.canvas, document.getElementById("game").childNodes[0]);

        // melakukan update atau menjalankan game secara terus menerus jika komponen mengalami perubahan
        this.interval = setInterval(updateGame , 20)

        // jika memencet keyboard
        window.addEventListener("keydown", function(event){
            arena.keys = arena.keys || []
            arena.keys[event.keyCode] = event.type == "keydown"
        })

        // jika melepas keyboard
        window.addEventListener("keyup", function(event){
            arena.keys[event.keyCode] = event.type == "keydown"
        })

        this.frameNo = 0
    },
    clear: function(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height) // untuk membersihkan atau menghapus context yang berada di dalam canvas
    },
    stop: function(){
        clearInterval(this.interval) // untuk memberhentikan permainan
    }

}


// konfigurasi player
function komponen(width, height, color, x, y, type){
    this.type = type
    if(type == "image" || type == "background"){
        this.image = new Image() // built in function untuk menambahkan image
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
        // mendefinisikan sebuah context yang berada di dalam canvas
        konteks = arena.context
        
        if(this.type == "text"){
            // mencetak teks
            konteks.font = this.width + " " + this.height
            konteks.fillStyle = color
            konteks.fillText(this.text, this.x, this.y)
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
        this.speedGravity += this.gravity // menambahkan kecepatan tarikan gravitasi
        this.x += this.speedX
        this.y += this.speedY + this.speedGravity // membuat player jatuh sesuai kecepatn gravitasi

        this.dead() // menjalankan pengecekan jika menyentuh lantai

        // player menyentuh atap
        if(this.y <= 0){
            this.speedY = 0
            lompat = false
        }else if(this.y >= this.height + 10){
            // jika player sudah mencapai ketinggian tertentu maka baru bisa lompat kembali
            this.speedY = 0
            lompat = true
        }

        // menggerakan sayap 
        if(this.speedGravity > 0.5){
            this.image.src = "assets/img/birdfall.png" // jika player jatuh
        }else{
            this.image.src = "assets/img/birdfly.png" // jika player lompat
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
        
        // jika player tidak menabrak arena akan menjalankan sistem ini
        if(bawah < atasRintangan || atas > bawahRintangan || kanan < kiriRintangan || kiri > kananRintangan){
            crash = false
        }

        return crash
        
    }

    this.score = function(score){
        // player
        var kiri = this.x
        var kanan = this.x + this.width
        var atas = this.y
        var bawah = this.y + this.height

        // score
        var kiriScore = score.x
        var kananScore = score.x + score.width
        var atasScore = score.y
        var bawahScore = score.y + score.height

        var poin = true

        // jika player tidak mengenai score
        if(bawah < atasScore || atas > bawahScore || kanan < kiriScore || kiri > kananScore){
            poin = false
        }

        return poin
        
    }

    // kondisi jika player menginjak lantai
    this.dead = function (){
        var lantai = arena.canvas.height - this.height

        // jika player mengenai lantai 
        if(this.y >= lantai){
            arena.stop()
        }
    }
}

function everyInterval(n){
    // menghitung gap atau jarak munculnya sebuah rintangan
    if((arena.frameNo / n) % 1 == 0){
        return true
    }

    return false

}

function startGame(){
    arena.start()

    // membuat player
    player = new komponen(50, 50, "assets/img/birdfall.png", arena.canvas.width/2 - 50, arena.canvas.height / 2 - 30, "image")

    // membuat background
    background = new komponen(window.innerWidth, window.innerHeight, "assets/img/background.jpg", 0, 0, "background")

    // membuat score 
    scorePlayer = new komponen("20px", "sans-serif", "white", 20, 40, "text")

}

function updateGame(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // membuat sebuah kondisi  jika player menabrak pipa
    for(i = 0; i < rintangan.length; i++){

        // jika variable crash yang berada di function pipa mengeluarkan tipe data true
        if(player.pipa(rintangan[i])){
            arena.stop() // memberhentikan permainan
        }
    }

    // mengecek jika player melewati pipa
    for(i = 0; i < jumlahScore.length; i++){

        // jika variable poin yang berada di function score mengeluarkan tipe data true
        if(player.score(jumlahScore[i])){
            score++ // menambahkan score
            jumlahScore.shift() // menghilangkan score jika sudah tersentuh oleh player
        }
    }

    arena.clear() // membersihkan arena

    arena.frameNo += 1

    // mengatur kemunculan rintangan
    if(arena.frameNo == 1 || everyInterval(70)){
        x = arena.canvas.width
        minHeight = 50
        maxHeight = 150

        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)

        // merubah ukuran rintangan jika score sudah mencapai 3
        if(score >= 3){
            minGap = 100
            maxGap = 300
        }else{
            minGap = 400
            maxGap = 400
        }

        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)

        // membuat rintangan atas
        rintangan.push(new komponen(30, height, "pink", x, 0 ))

        // membuat rintangan bawah
        rintangan.push(new komponen(30,x - height - gap, "pink", x, height + gap ))

        // membuat point yang tidak terlihat
        jumlahScore.push(new komponen(5, arena.canvas.height, "transparent", x + 25, 0))

    }

    background.update() // menampilkan background
    
    // menggerakan, menampilkan rintangan
    for(i = 0; i < rintangan.length; i++){
        rintangan[i].x += -3
        rintangan[i].update()
    }

    // menggerakan, menampilkan score
    for(i = 0; i< jumlahScore.length; i++){
        jumlahScore[i].x += -3
        jumlahScore[i].update()
    }

    // controller
    if(arena.keys && arena.keys[32]){
        if(lompat){
            player.speedY = -10
            player.speedGravity = 0
        }
    }

    // menambahkan tulisan score
    scorePlayer.text = "SCORE : " + score // tanda + untuk menyatukan antara string dengan variable atau biasa di sebut sebagai concat
    scorePlayer.update() // menampilkan score

    player.newPosition() // mengubah posisi pemain
    player.update() // menampilkan pemain
}
