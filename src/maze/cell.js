export class Cell {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        }
        this.walls = {
            top: true,
            bottom: true,
            left: true,
            right: true
        };
        
        this.isVertex = false;

    }

    Draw(options) {

        this.dirty = false;

        let cellWidth = options.width;
        let cellHeight = options.height;
        let baseX = cellWidth * this.position.x;
        let baseY = cellHeight * this.position.y;


        if(!this.activeStyle) {
            p.noStroke();
            //p.fill(0);
            //p.rect(baseX, baseY, cellWidth + 1, cellHeight + 1);
            //return;
        }

        let inset = 1;

        if(options.fill) {
            p.noStroke();
            p.fill(options.fill[0], options.fill[1], options.fill[2], options.fill[3] || 255);
            p.rect(baseX + inset, baseY + inset, cellWidth + 1 - (inset * 2), cellHeight + 1 - (inset * 2));
        }

        // if(this.isVertex){
        //     p.noStroke();
        //     p.fill(0, 0, 255, 40);
        //     let radiusScale = 0.5;
        //     p.ellipse(baseX + (cellWidth / 2), baseY + (cellHeight / 2), cellWidth * radiusScale, cellHeight * radiusScale);
        // }


        // Draw walls
        p.stroke(0, 0, 0, 255);
        p.strokeCap(p.SQUARE);
        p.strokeWeight(1);

        if(this.walls.bottom) {
            let x1 = baseX;
            let y = baseY + cellHeight;
            let x2 = baseX + cellWidth;
            p.line(x1, y, x2, y);
        }
        if (this.walls.right) {
            let x = baseX + cellWidth;
            let y1 = baseY;
            let y2 = baseY + cellHeight;
            p.line(x, y1, x, y2);
        }
        
    }

    NumWalls() {
        let count = 0;
        if(this.walls.top) count += 1;
        if(this.walls.bottom) count += 1;
        if(this.walls.left) count += 1;
        if(this.walls.right) count += 1;

        return count;
    }

    // Important! The string representation needs to be unique in the context of the grid
    // so that indexing by it is possible. (No two cells should give the same name).
    toString() {
        return `Cell (${this.position.x}, ${this.position.y})`;
    }



}