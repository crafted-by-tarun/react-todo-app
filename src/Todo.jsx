import { useEffect, useState } from "react"
import { FaFilter } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "./styles.css";
export default function Todo() {
    let [text, setText] = useState("");
    // let [tasks,setTasks] = useState([]);
    let [editID, setEditID] = useState(null);
    let [filter, setFilter] = useState("All");
    // useEffect(()=>{
    //     let mystring = localStorage.getItem("tasks");
    //     if(mystring) setTasks(JSON.parse(mystring));

    // },[]);
    // useEffect(()=>{localStorage.setItem("tasks",JSON.stringify(tasks))},[tasks]);
    // 1. Initialize state directly from localStorage
    const [tasks, setTasks] = useState(() => {
        const mystring = localStorage.getItem("tasks");
        return mystring ? JSON.parse(mystring) : [];
    });

    // 2. Keep ONLY this useEffect to save changes
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);
    const completed = tasks.filter(task => task.completed).length;
    let filteredtasks = tasks;
    if (filter === "Active") filteredtasks = tasks.filter(task => !task.completed);
    if (filter === "Completed") filteredtasks = tasks.filter(task => task.completed);
    function add_handler() {
          if (text.trim() === "") {

        toast.warning("Please enter a task");

        return;

    }
        toast.success("Task Added");
        const newtask = {
            id: Date.now(),
            text: text,
            completed: false
        }
        setTasks([...tasks, newtask]);
        setText("");
    }
    function delete_handler(id) {
        toast.error("Task Deleted");
        let newtasks = tasks.filter(task => task.id !== id);
        setTasks(newtasks);
    }
    function edit_handler(id) {
        let editTask = tasks.find(task => task.id === id);
        setText(editTask.text);
        setEditID(id);
    }
    function update_handler() {
        toast.info("Task Updated");
        setTasks(tasks.map(task => task.id === editID ? { ...task, text: text } : task));
        setText("");
        setEditID(null);
    }
    function checkbox_handler(id, e) {
        setTasks(tasks => tasks.map(task => task.id === id ? { ...task, completed: e.target.checked } : task));
    }

    return (
        <div className="todo-container">
            <h1>TO DO LIST</h1>
            <br />  <br />  <br />
            <div className="input-container"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { editID !== null ? update_handler() : add_handler() } }} placeholder="Enter task" ></input>
                {editID === null ? <button onClick={add_handler}>Add Task</button> : <button onClick={update_handler}>Update</button>} <br />  <br />  <br /></div>

            <div className="filters-container">
                <FaFilter className="filter-icon" />
                <button disabled={filter === "All"} onClick={() => setFilter("All")}>All  </button>
                <button disabled={filter === "Active"} onClick={() => setFilter("Active")}>Active </button>
                <button disabled={filter === "Completed"} onClick={() => setFilter("Completed")}>Completed </button></div>
            <br />  <br />  <br />
            {filteredtasks.length > 0 && (<div className="tasks-list">{
                filteredtasks.map((task) => {
                    return <div className="task" key={task.id}>
                        <div className="task-left">
                            <input type="checkbox" checked={task.completed}value={task.text} onChange={(e) => { checkbox_handler(task.id, e) }}></input>
                            <span className={task.completed ? "completed" : ""}>{task.text}</span></div>
                        <div className="task-right">
                          <div className = "edit-btn"><FaRegEdit onClick={() => { edit_handler(task.id) }}/></div>  

                           <div className="delete-btn"><MdDelete  onClick={() => { delete_handler(task.id) }}/></div> 
                      

                    </div></div>;
                })
            }</div>)}
            <br />  <br />  <br />
            <h2>COMPLETED {completed} OUT OF {tasks.length}</h2>

        </div>
    );
}