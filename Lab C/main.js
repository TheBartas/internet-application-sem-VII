class Puzzle {
    constructor() {
        this.map = L.map('map').setView([53.430127, 14.564802], 18);
        L.tileLayer.provider('Esri.WorldImagery').addTo(this.map);
        this.marker = null;
        this.puzzles = [];
        this.cols = 4;
        this.rows = 4;
        this.max_shuffle = 30;
    }

    getLocation() {
        document.getElementById("button-get-location").addEventListener("click", () => {
            if (!navigator.geolocation) {
                alert("Error with geolocation!");
            }

            navigator.geolocation.getCurrentPosition(position => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                this.map.setView([lat, lon]);

                this.marker = L.marker([lat, lon]).addTo(this.map);
                this.marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
            })
        });
    }

    saveImage() {
        document.getElementById("button-save").addEventListener("click", () => {
            leafletImage(this.map, (err, canvas) => {
                let rasterMap = document.getElementById("raster-map");
                let rasterContext = rasterMap.getContext("2d");

                rasterMap.width = canvas.width; 
                rasterMap.height = canvas.height;
                
                rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
                rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

                this.createPuzzles(rasterMap, rasterContext);
                this.shuffle();
                this.drawPuzzles();
                this.dragAndDrop();
            });
        });
    }

    createPuzzles(rasterMap, rasterContext) {
        this.puzzles = [];
        
        const pieceWidth = rasterMap.width / this.cols;
        const pieceHeight = rasterMap.height / this.rows;

        let id = 0

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const x = j * pieceWidth;
                const y = i * pieceHeight;

                const imgData = rasterContext.getImageData(x, y, pieceWidth, pieceHeight);

                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceWidth;
                pieceCanvas.height = pieceHeight;
                const pieceContext = pieceCanvas.getContext('2d');

                pieceContext.putImageData(imgData, 0, 0);

                const imgSrc = pieceCanvas.toDataURL();

                this.puzzles.push({
                    id: id++,
                    imgData: imgSrc,
                });
            }
        }
    }

    shuffle() {
        let counter = 0;

        while (true) {
            counter++;

            let i = 0, j = 0;

            do {
                j = Math.floor(Math.random() * (16 + 0));
                i = Math.floor(Math.random() * (16 + 0));
            } while(j == i);


            [this.puzzles[i].imgData, this.puzzles[j].imgData] = [this.puzzles[j].imgData, this.puzzles[i].imgData];
            [this.puzzles[i].id, this.puzzles[j].id] = [this.puzzles[j].id, this.puzzles[i].id];


            if (counter == this.max_shuffle) break;
        }
    }

    drawPuzzles() {
        const puzzlesContainer = document.getElementById('puzzles');
        puzzlesContainer.innerHTML = ''; 

        for (let puzzle of this.puzzles) {
            const imgForPuzzle = document.createElement('img');
            imgForPuzzle.id = puzzle.id;
            imgForPuzzle.src = puzzle.imgData;
            imgForPuzzle.draggable = true;
            imgForPuzzle.classList.add('puzzle');
            puzzlesContainer.appendChild(imgForPuzzle);
        }
    }

    dragAndDrop() {
        let puzzles = document.querySelectorAll('.puzzle');
        for (let puzzle of puzzles) {
            const puzzleID = puzzle.id;

            puzzle.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData('img_id', puzzleID);
            });

            puzzle.addEventListener("dragend", () => {
            });
        }

        let target = document.querySelector(".target");

        target.addEventListener("dragenter", () => {
            target.style.border = "2px solid #7FE9D9";
        });

        target.addEventListener("dragleave", () => {
            target.style.border = "2px dashed #7f7fe9";
        });

        target.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        target.addEventListener("drop", (e) => {
            e.preventDefault(); 
            let imgId = e.dataTransfer.getData('img_id');
            let imgToDiv = document.getElementById(imgId);

            let rect = target.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            let col = Math.floor(x / (rect.width / 4));
            let row = Math.floor(y / (rect.height / 4));

            let targetCell = target.querySelector(`[data-col="${col + 1}"][data-row="${row + 1}"]`);

            if (targetCell.getAttribute('data-value') === 'empty') {

                const currentCell = document.querySelector(`[data-value='img'][data-col="${imgToDiv.style.gridColumn}"][data-row="${imgToDiv.style.gridRow}"]`);
                if (currentCell) {
                    currentCell.setAttribute('data-value', 'empty');
                    currentCell.setAttribute('data-img-id', -1);
                }

                imgToDiv.style.gridColumn = col + 1;
                imgToDiv.style.gridRow = row + 1;
                targetCell.setAttribute('data-value', 'img');
                targetCell.setAttribute('data-img-id', imgId);

                target.appendChild(imgToDiv);
                target.style.border = "2px dashed #7f7fe9";
                target.style.boxShadow = "0 4px 10px rgba(255, 105, 180, 0.6)";

                if (puzzle.isWin()) {
                    console.log('You win!');
                    target.style.border = "2px dashed #39FF14";
                    target.style.boxShadow = "0 4px 10px rgba(57, 255, 20, 0.6)";
                    this.showNotification('You win!');
                };
            } else {
                target.style.border = "2px dashed #ff073a";
                target.style.boxShadow = "0 4px 10px rgba(255, 7, 58, 0.6)";
            }

        }, false);
    }

    createGrid(rows, cols) {
        let target = document.getElementById('map-puzzle');
        let id = 0;
    
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= cols; col++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-col', col);
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-value', 'empty');
                cell.setAttribute('data-id', id);
                cell.setAttribute('data-img-id', -1);
                target.appendChild(cell);
                id++;
            }
        }
    }

    isWin() {
        const cells = document.querySelectorAll('.cell');
        let i = 0;
        console.log(cells.length);
    
        for (let cell of cells) {
            const data_id = cell.getAttribute('data-id');
            const data_img_id = cell.getAttribute('data-img-id');

            if (data_id !== data_img_id) {
                return false;
            }
            i++;
        }
    
        return true;
    }

    showNotification(message) {
        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }
}



const puzzle = new Puzzle();

puzzle.createGrid(4, 4);

puzzle.getLocation();

puzzle.saveImage();





