//this is the main div that will be changed.
const mainViewDiv=document.querySelector(".main")    

// main current user DB.
const users=[]
let sudoku=[]
let sudoku_copy=[]
let current_user=""

class Player 
{
    constructor(name,email,password,default_difficulty) 
    {
      this.name=name;
      this.email=email;
      this.password=password;
      this.default_difficulty=""
    }

    set_difficulty(default_difficulty) 
      {
        switch (default_difficulty) 
        {
            case "Easy":
                this.default_difficulty=81-Math.floor((81*75)/100)
                break;
            case "Medium":
                this.default_difficulty=81-Math.floor((81*50)/100)
                break;      
            case "Hard":
                this.default_difficulty=81-Math.floor((81*25)/100)
                break;          
            default:
            console.log("");
        }
      }
}

// this will build a an empty sudoku array
function initialize_matrix(){
    sudoku=[];
    for(let x=0;x<9;x++)
    {
        let arr=[]
        for(let y=0;y<9;y++)
        {
            arr.push(0);
        }
        sudoku.push(arr)
    }    
    initialize_copy()
}

// this will build a second empty sudoku array 
function initialize_copy(){
    for(let x=0;x<9;x++)
    {
        let arr=[]
        for(let y=0;y<9;y++)
        {
            arr.push(0);
        }
        sudoku_copy.push(arr)
    }    

}

//=============================== PAGES HANDLER AND VALIDATORS =========================================
//generates a login page
function login_page()
{
   mainViewDiv.innerHTML=
   `
   <h1> Welcome to Sudoko.<br> Please Login or register</h1>
    <form action="#" onsubmit="validate_user();return false">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="emailfield" aria-describedby="emailHelp" placeholder="Enter email" required autocomplete="current-email">
          <small id="loginemailsmall"></small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="passwordfield" placeholder="Password" required=true autocomplete="current-password">
          <small id="passwordsmall"></small>
        </div>
        <button class="btn btn-primary">Login</button>
        <button class="btn btn-primary" onclick="register_page()">Register</button>
</form>
   `
}

//generates a register page
function register_page()
{
    mainViewDiv.innerHTML=
    `
    <h1> Welcome to Sudoko.<br> Please Register</h1>
    <form action="#" onsubmit="add_user();return false">
        <div class="form-group">
          <label for="namefield">Name</label>
          <input type="text" class="form-control" id="namefield" placeholder="Enter name" required>
        </div>
        <div class="form-group">
          <label for="emailfield">Email</label>
          <input type="email" class="form-control" id="emailfield" aria-describedby="emailHelp" placeholder="Enter email" required autocomplete="email">
          <small id="regemailsmall"></small>
        </div>
        <div class="form-group">
            <label for="passwordfield">Password</label>
            <input type="password" class="form-control" id="passwordfield" placeholder="Password" required=true autocomplete="current-password">
        </div>
        <div class="form-group">
                <label for="exampleFormControlSelect1">Select default difficulty</label>
                <select class="form-control" id="selectfield">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
        <button class="btn btn-primary" onclick="login_page()">Login</button>
        <button class="btn btn-primary">Register</button>
</form>
    `
}

//validate user and enters the sudoku board
function validate_user()
{
    let useremail=document.getElementById("emailfield").value
    let userpassword=document.getElementById("passwordfield").value
    current_user=users[validate_email(useremail)]
    
    if(current_user==undefined)
    {
        document.getElementById("passwordsmall").innerHTML=""
        document.getElementById("loginemailsmall").style.color="red"
        document.getElementById("loginemailsmall").innerHTML=`email ${useremail} not found!`
    }
    else if(current_user.password!=userpassword)
    {
        document.getElementById("loginemailsmall").innerHTML=""
        document.getElementById("passwordsmall").style.color="red"
        document.getElementById("passwordsmall").innerHTML=`Password is incorrect`  
    }
    else
    {
        draw_board();
    }
}

//add user to db
function add_user()
{
    let username=document.getElementById("namefield").value
    let useremail=document.getElementById("emailfield").value
    let userpassword=document.getElementById("passwordfield").value
    let userdifficulty=document.getElementById("selectfield").value
    if(validate_email(useremail)>=0)
    {
        document.getElementById("regemailsmall").style.color="red"
        document.getElementById("regemailsmall").innerHTML=`email ${useremail} is taken`
    }
    else
    {
        let new_player = new Player(username,useremail,userpassword,userdifficulty)
        users.push(new_player);
        login_page();
    }
}

//validate the email
function validate_email(email)
{
    let user_location;
    users.forEach((element,index) => {
        
        if(element.email==email)
        {            
            user_location = index;
        }
        else
        {
            user_location = -1;
        }
    });    
    return user_location;
}

//======================================================================================================

//========================================== CELL CHECK AND VALIDATE ===================================
//check if number can fit to a row
function check_row(number,row,matrix) {
	for (let i=0; i<matrix[0].length; i++) {
		if (matrix[row][i] == number) {
            //return false if that number exists 
            //in that row
			return false;
		}
	}
	return true;
}

//check if number can fit to a column
function check_col(number,col,matrix) {        
    for (let i=0; i<matrix[0].length; i++) 
    {        
        if (matrix[i][col] == number) 
        {
            //return false if that number exists 
            //in that column
			return false;
		}
	}
	return true;
}

//check if number can fit to a block of 3X3
function check_block(number,row,col,matrix) 
{
	let bigrow=Math.floor(((row)/3))*3
	let bigcol=Math.floor(((col)/3))*3       
	for(let x=0;x<3;x++)
	{
		for(let y=0;y<3;y++)
		{
			if(matrix[bigrow+x][bigcol+y]==number)
			{
                //return false if that number exists 
                //in that 3X3
				return false
			}
		}
	}
	return true;
}
// check if a number can be placed in a cell by
// running check on all
function check_number(number,row,col,matrix) 
{
	return check_row(number,row,matrix) && check_col(number,col,matrix) && check_block(number,row,col,matrix);
}

//goes trough the given row and check if values are valid
function validate_row(row,matrix) 
{
	let rightSequence = [1,2,3,4,5,6,7,8,9];
	let rowTemp= [];
	for (let i=0; i<=8; i++) {
		rowTemp.push(matrix[row][i]);
	}
	rowTemp.sort();
	return rowTemp.join() == rightSequence.join();
}

//goes trough the given column and check 
//if values are valid
function validateCol(col,matrix) 
{
	let rightSequence = [1,2,3,4,5,6,7,8,9];
	let colTemp= [];
	for (let i=0; i<=8; i++) {
		colTemp.push(matrix[i][col]);
	}
	colTemp.sort();
	return colTemp.join() == rightSequence.join();
}

//goes trough the given 3x3 block and check 
//if values are valid
function validateBlock(row,col,matrix) 
{
	let rightSequence = [1,2,3,4,5,6,7,8,9];
	let blockTemp= [];
	let bigrow=Math.ceil(((row+1)/3))*3
	let bigcol=Math.ceil(((col+1)/3))*3   
	
	for(let x=1;x<=3;x++)
	{
		for(let y=1;y<=3;y++)
		{
			blockTemp.push(matrix[bigrow-x][bigcol-y])
		}
	}
	blockTemp.sort();
	return blockTemp.join() == rightSequence.join();
}
//======================================================================================================

//============================================ BOARD LOGIC =============================================

//check if a sudoku is solved by running
// row, col and block validation functions
function is_sudoku_solved(matrix) 
{
    for (let i=0; i<matrix[0].length; i++) 
    {
        if (!validateBlock(i,i,matrix)) {
            return false;
        }
    }
    return true;
}

// returnes an array of all possible value that 
//can be put a cell  by running check_number function 
//and returns an empty array if no values found
function get_Possible_Values_For_A_Cell(row,col,matrix)
{
	let possible = [];
	for (let number=1; number<=9; number++) 
	{
		if (check_number(number,row,col,matrix)) 
		{
			possible.unshift(number);
		}
	}	
	return possible;
}

//pick a random value from a given array of possible values
//that we get from running get_Possible_Values_For_A_Cell
//function
function pick_random_value_from_Possible_values(possible) {
    if(possible.length == 0)
        return false
    else{
    //randomPicked will return a location a from the array
    let randomPicked = Math.floor(Math.random() * possible.length);
    return possible[randomPicked];
    }
}

//returns an array of all possiblitys for every cell
function build_array_of_possible_values(matrix) 
{
    let possibleArray = [];
    //initialize the cell grid array
	for (let index = 0; index < matrix.length; index++) 
	{   
        possibleArray.push([])
		possibleArray[index].push([])
    }
    
	for(let x=0;x<matrix[0].length;x++)
    {
		for(let y=0;y<matrix[0].length;y++)
		{            
            //if cell is avilable set is as array
            possibleArray[x][y] = [];
			if(matrix[x][y]==0)
			{
				possibleArray[x][y] = get_Possible_Values_For_A_Cell(x,y,matrix);
				if(possibleArray[x][y].length==0)
				{
					//if no avilable possibilyty return false
					return false;
				}
			}
		}
    }	

    return possibleArray;
}

//gets an array and removes values from it
//we use this to elemenate posibilities
function remove_value_from_possible_values_array(array,number) {
	var newArray = []
	for (var i=0; i<array.length; i++) 
	{
		if (array[i] != number) {
			newArray.unshift(array[i]);
		}
	}
	return newArray;
}

//find a cell with lowest number of possibilities
//and retunes its index
function pick_location_from_avilable_possibilities(possibility_arry) {    
    let location=[]
    let max = 9
    
    for(let x=0;x<possibility_arry.length;x++)
    {
        for(let y=0;y<possibility_arry.length;y++)
        {            
          if((possibility_arry[x][y].length<=max) && (possibility_arry[x][y].length>0))
          {
              max=possibility_arry[x][y].length;
              location=[x,y]
          }
        }
    }
    return location
}

//copies the board to another array
function copy_board(from,to)
{
    for(let x=0;x<9;x++)
    {
        for(let y=0;y<9;y++)
        {
            to[x][y]=from[x][y]
        }
    }
}

// draw and fill the sudoku
function draw_board()
{
    copy_board(sudoku,sudoku_copy)

    show_menu()
    let add_html=""
    add_html=add_html+(`
    <table id="sudoku_table">
    <tbody>
    `)
    let count=1
    
    for(let x=0;x<9;x++)
    {
        add_html+=(`<tr id="row${x}"></tr>`)
        for(let y=0;y<9;y++)
        {
            if(sudoku[x][y]==0)
            {
                add_html+=(`<td id="Col${count}"> <input type="text" name="cellinput" id="cell_[${x}][${y}]"  required pattern="[0-9]" maxlength="1" min="1" max="9" oninput="cell_input(${x},${y})" onfocusout="focus_out(${x},${y})" onkeypress="allowNumbersOnly(event)"></td>`)
            }
            else
            {
                add_html+=(`<td id="Col${count}"> <input id="cell_[${x}][${y}]" type="text" pattern="[^a-z]" maxlength="1" min=1 max="9" value="${sudoku[x][y]}" disabled></td>`)
            }
            count++;
        }
    }
    add_html+=(`
     </tbody>
    </table>
    `)
    mainViewDiv.innerHTML=add_html;
}

// removes the numbers from cells by difficulty
function remove_values_from_board(diff)
{
    let values_to_remove=[]

    //make sure we get different locations 
    while (values_to_remove.length<diff)
    {
        let row = Math.floor(Math.random()*9)
        let col = Math.floor(Math.random()*9)
        let location =[row,col]
        let exists=false;
        if(values_to_remove.length==0)
        {
            values_to_remove.push(location)
        }
        values_to_remove.forEach(element => {
            if (element[0] == location[0] && element[1]==location[1])
            {
                exists=true;
            }
        });
        if(!exists)
        {
            values_to_remove.push(location)
        }
    }

    //removes the locations from the matrix
    values_to_remove.forEach(element =>{

        sudoku[element[0]][element[1]]=0
    })
}

//solves the sudoku
function solve() 
{
    let possibilities=[]
    saved_possibilities=[]
    saved_sudoku_board=[]
    let cell_loaction=[]
    let number_to_try=-1
    let row=-1
    let col=-1
    console.log("SOLVE:",sudoku==undefined);
    console.log("SOLVE:",sudoku);
    while(!is_sudoku_solved(sudoku))
    {
        possibilities=build_array_of_possible_values(sudoku)
        
        if(possibilities==false)
        {
            //if we are here then the board is not solved
            //and we need to go back
            //loading the board and possibilities
            possibilities=saved_possibilities.pop();
            sudoku=saved_sudoku_board.pop();
        }
        if(possibilities != undefined)
        {
        //get a location of cell
        
        cell_loaction=pick_location_from_avilable_possibilities(possibilities)
        row=cell_loaction[0]
        col=cell_loaction[1]
        //pic a number to try from that location
        number_to_try=pick_random_value_from_Possible_values(possibilities[row][col])        
        if(possibilities[row][col].length>1)
        {            
            //we have more then one possibily here we need to save
            //the board and possibilites minus the one we gonna use
            possibilities[row][col] = remove_value_from_possible_values_array(possibilities[row][col],number_to_try) 
            saved_possibilities.push(possibilities)
            saved_sudoku_board.push(sudoku)
        }
       // console.log(`set ${number_to_try}`);
       sudoku[row][col]=number_to_try
        }

    }
    remove_values_from_board(current_user.default_difficulty)
}

//================================================MENU ITEM AND BUTTONS HANDLERS==========================

// hids the menu
function hide_menu()
{
    let menuitem=document.querySelector(".menu")
    menuitem.style.display = "block"
    menuitem.style.display = "none"

}

//shows the menu
function show_menu()
{
    document.querySelector("a.navbar-brand").innerHTML=`Sudoku Welcom ${current_user.name}`
    let menuitem=document.querySelector(".menu")
    menuitem.style.display = "block"
}

//resets current board to initial values
function reset_current_board()
{
    console.log("RESET");
    copy_board(sudoku_copy,sudoku)
    draw_board();
}

// on click of the check button and opens a modal with message
function check_board()
{
    if(is_sudoku_solved(sudoku))
    {
        $('#exampleModalCenter').modal('show')
        document.getElementById("modal_body").innerHTML=`Sudoku is finished`
    }
    else
    {
        $('#exampleModalCenter').modal('show')
        document.getElementById("modal_body").innerHTML=`Sudoku is not finished yet`
    }

}

//creates a new board 
function new_board()
{
    initialize_matrix();    
    solve(sudoku);
    draw_board();
}

//copy the matrix of a board from one to another.
function copy_board(from,to)
{    
    for(let x=0;x<9;x++)
    {
        for(let y=0;y<9;y++)
        {
            to[x][y]=from[x][y]
        }
    }
}

// logs the user out
function log_out()
{
    hide_menu();
    initialize_matrix()
    solve(sudoku)
    login_page();
    
}

//set difficulty after its changed in the menu
function selector_change()
{
    let selector=document.getElementById("selectfield").value
    console.log("DIFF WAS:",current_user.default_difficulty);
    current_user.set_difficulty(selector)
    console.log("DIFF NOW:",current_user.default_difficulty);

}

//======================================================================================================

//============================INPUT COLORING AND VALIDATION SECTION=====================================

//validates and maks sure that input to have only nubers
function allowNumbersOnly(e) {
    var code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) 
    {
        e.preventDefault();
    }
}

//activates on input of a number and colors the border after validation.
function cell_input(row,col)
{
    let cell=document.getElementById(`cell_[${row}][${col}]`);
    if(!check_number(cell.value,row,col,sudoku))
    {
        cell.style.borderColor = "red";
        cell.style.borderWidth = "4px";
    }
    else
    {
        cell.style.borderColor = "green";
    }
}

//activates on out of focus  and colors the border after validation.
function focus_out(row,col)
{
    let cell=document.getElementById(`cell_[${row}][${col}]`);

    //if number is valid color green
    if(!check_number(cell.value,row,col,sudoku))
    {
        if(!cell.value=="")
        {
            cell.style.borderColor = "red";
            cell.style.borderWidth = "4px";
        }
    }
    else
    {
        cell.style.borderColor = "black";
        cell.style.borderWidth = "1px";
    }

    if(cell.value=="")
    {
        cell.style.borderColor = "black";
        cell.style.borderWidth = "1px";
    }


}

//======================================================================================================


//====================================== MAIN ==========================================================
users.push(new Player("Edi","1@1.com","1111","Easy"))
users[0].set_difficulty("Easy")
current_user=users[0]
initialize_matrix()
hide_menu()
solve(sudoku)
//draw_board()
login_page()
