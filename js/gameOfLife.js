var app = angular.module("gameOfLife", []);

app.controller ('GameOfLifeCntl', function($scope, $timeout){

    //settings
    $scope.height = $scope.width = 20;

    //start Game
    $scope.newGame = function () {
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
    (function(){
        $scope.newGame()
    })();

    //next step
    $scope.next = function () {
        $scope.board = computeNext($scope.board);
    };
    //auto create
    $scope.start = function(){
        cancelRefresh = $timeout(function myFunction() {
            $scope.next();
            cancelRefresh = $timeout(myFunction,500);
        },500);
    };

    $scope.stop = function(){
        $timeout.cancel(cancelRefresh);
      /*  $scope.$on('$destroy', function(e) {

        });*/
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
        return newBoard;
    }

    //chick choose
    $scope.toggle = function (row, cell) {
        $scope.board[row][cell] = !$scope.board[row][cell];
        console.log("You die or live new cell");
    };


    //game rules
    //якщо у живої клітини два чи три сусіди – то вона лишається жити;
    function willLive(board, row, cell) {
        if (inBoard(board, row, cell)
            && neighbours(board, row, cell) >= 2
            && neighbours(board, row, cell) <= 3){
            return true;
        }else{
            return false;
        }

    }
    //якщо у мертвої клітини рівно три сусіди – то вона оживає.
    function newCell(board, row, cell) {
        if (!inBoard(board, row, cell)
            && neighbours(board, row, cell) == 3){
            return true;
        }else{
            return false;
        }
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
        if (row >= 0   && row < board.length &&
            cell >= 0  && cell < board[row].length &&
            board[row][cell])
        {
            return true;
        }else{
            return false;
        }
    }



});