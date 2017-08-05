export class Cell {
    constructor(x, y, maze) {
        this.position = {
            x: x,
            y: y
        }
        this.maze = maze;

        this.walls = {
            top: true,
            bottom: true,
            left: true,
            right: true
        };
        
        this.isVertex = false;

        this.drawing = {
            fillColor: "white",
            dirty: false,
            rect: this.GetDrawRect(),
            routine: (event) => {

            }
        }

        this.background = new Path.Rectangle({
            point: [this.drawing.rect.x, this.drawing.rect.y],
            size: [this.drawing.rect.w, this.drawing.rect.h],
            strokeWidth: 0
        });

        this.wallPath = new Path({
            strokeColor: "black",
            strokeWidth: 1,
            strokeJoin: 'round'
        });
        this.wallPath.moveTo(this.drawing.rect.x, this.drawing.rect.y);
        this.wallPath.lineTo(this.drawing.rect.x + this.drawing.rect.w, this.drawing.rect.y); // make top
        this.wallPath.lineTo(this.drawing.rect.x + this.drawing.rect.w, this.drawing.rect.y + this.drawing.rect.h); // make right
        this.wallPath.lineTo(this.drawing.rect.x, this.drawing.rect.y + this.drawing.rect.h); // make bottom
        this.wallPath.lineTo(this.drawing.rect.x, this.drawing.rect.y); // make left

        this.maze.mazePath.addChild(this.wallPath);

        this.group = new Group([this.background]);

    }

    Draw(event) {

        this.drawing.dirty = false;
        
        this.background.fillColor = this.drawing.fillColor;

        // Minor speedup. Don't draw the background if it's white (fall back to global background white)
        this.background.visible = this.drawing.fillColor != "white";

        // if(!this.activeStyle) {
        //     this.background.fillColor = "white";
        // }

        /// Regenerate the walls

        // Remove all segments in wallPath
        this.wallPath.removeSegments();

        if(this.walls.right){
            this.wallPath.add(new Point(this.drawing.rect.x + this.drawing.rect.w, this.drawing.rect.y)); // make top
            this.wallPath.add(new Point(this.drawing.rect.x + this.drawing.rect.w, this.drawing.rect.y + this.drawing.rect.h));
        }
        if(this.walls.bottom) {
            if(!this.walls.right)
                this.wallPath.add(new Point(this.drawing.rect.x + this.drawing.rect.w, this.drawing.rect.y + this.drawing.rect.h));
            this.wallPath.add(new Point(this.drawing.rect.x, this.drawing.rect.y + this.drawing.rect.h));
        }

        // Call the custom drawing routine if specified
        this.drawing.routine.call(this, event);
        
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

    GetDrawRect() {
        let cellWidth = view.size.width / this.maze.width;
        let cellHeight = view.size.height / this.maze.height;
        let baseX = cellWidth * this.position.x;
        let baseY = cellHeight * this.position.y;

        return {
            x: baseX,
            y: baseY,
            w: cellWidth,
            h: cellHeight
        }
    }

    SetDrawOption(optionName, val) {
        this.drawing[optionName] = val;
        this.drawing.dirty = true;
    }

    GetMidPoint() {
        return new Point(this.drawing.rect.x + (this.drawing.rect.w / 2.0), this.drawing.rect.y + (this.drawing.rect.h / 2.0));
    }



}