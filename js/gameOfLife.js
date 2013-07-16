var app = angular.module("gameOfLife", []);

app.controller ('GameOfLifeCntl', function($scope, $timeout){
    var historyArray = [];
    //settings
    $scope.height = $scope.width = 10;

    //start Game
    $scope.newGame = function () {
        historyArray = [];
        $scope.history = [];
        $scope.board = init($scope.height, $scope.width);
    };

    //build new board
    function init(height, width) {
        var board = [];
        //h - height
        for (var h = 0 ; h < height ; h++) {
            var row = [];
            //w- width
            for (var w = 0 ; w < width ; w++) {
                //add rows
                row.push(false);
            }
            //add board
            board.push(row);
        }
        return board;
    }

    // create default settings

    $scope.newGame();

    //next step
    $scope.next = function () {
        $scope.history.push($scope.board);
        $scope.board = computeNext($scope.board);
    };
    var cancelRefresh;
    //auto create
    $scope.start = function(){
        cancelRefresh = $timeout(function myFunction() {
            $scope.next();
            cancelRefresh = $timeout(myFunction,500);
        },500);
    };

    $scope.step = function (index) {
        $scope.board = $scope.history[index];
        $scope.history = $scope.history.slice(0, index);
    };

    $scope.stop = function(){
        $timeout.cancel(cancelRefresh);
    };

    //create new figure
    function computeNext(board) {
        var newBoard = [];
            //r -row
            for (var r = 0 ; r < board.length ; r++) {
                var newRow = [];
                //c -cell
                for (var c = 0 ; c < board[r].length ; c++) {
                    newRow.push(willLive(board, r, c) || newCell(board, r, c));
                }
                newBoard.push(newRow);
            }
        if (checkBoard(newBoard)){
            return newBoard;
        }else{
            alert("Game over");
            //$scope.newGame();
            $scope.stop();
            return newBoard;
        }
    }

    function checkBoard(newBoard){
        var time = false;

        for (var r = 0 ; r < newBoard.length ; r++) {
            for (var c = 0 ; c < newBoard[r].length ; c++) {
                if (newBoard[r][c] == true){
                    time = true;
                }
            }
        }

        historyArray.push(hex_sha1(newBoard.toString()));

        for (var i = 0; i <= historyArray.length-2; i++){
            if (historyArray[i] == historyArray[historyArray.length - 1]){
                time = false;
            }
        }

        return time;
    }

    //chick choose
    $scope.toggle = function (row, cell) {
        $scope.history = []; // new points - new history
        $scope.board[row][cell] = !$scope.board[row][cell];
        console.log("You die or live new cell");
    };

    //game rules
    function willLive(board, row, cell) {
            return (inBoard(board, row, cell)
                && neighbours(board, row, cell) >= 2
                && neighbours(board, row, cell) <= 3);
    }

    function newCell(board, row, cell) {
            return (!inBoard(board, row, cell)
                && neighbours(board, row, cell) == 3);
    }

    //neighbours count
    function neighbours(board, row, cell) {
        var n = 0;
        //button -> top ; left -> right without row+0 cell+0 (choose cell)
        n += inBoard(board, row-1, cell-1) ? 1 : 0;
        n += inBoard(board, row-1, cell+0) ? 1 : 0;
        n += inBoard(board, row-1, cell+1) ? 1 : 0;
        n += inBoard(board, row+0, cell-1) ? 1 : 0;
        n += inBoard(board, row+0, cell+1) ? 1 : 0;
        n += inBoard(board, row+1, cell-1) ? 1 : 0;
        n += inBoard(board, row+1, cell+0) ? 1 : 0;
        n += inBoard(board, row+1, cell+1) ? 1 : 0;
        return n;
    }

    //cells only in board
    function inBoard(board, row, cell) {
            return (row >= 0   && row < board.length &&
                cell >= 0  && cell < board[row].length &&
                board[row][cell]);
    }

});
