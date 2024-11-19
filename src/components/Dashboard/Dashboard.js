import './Dashboard.css';
import { ReactComponent as Add } from "./add.svg";
import { ReactComponent as DotDotDot } from "./3 dot menu.svg";
import Card from '../Card/Card';
import UserIcon from '../UserIcon/UserIcon';
import { generateIntials, getRandomColor, priorities, statusIcons } from '../../utils/data';
import { useState } from 'react'; // Import useState for form state management

const Dashboard = ({ tickets, users, group, level, userId, order, data, onAddTicket }) => {
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [newTicket, setNewTicket] = useState({ title: '', priority: '', status: '', userId: '' }); // State for new ticket

    let filteredTickets = [];
    // Filter tickets based on grouping logic
    if (group === 'status') 
        filteredTickets = tickets.filter(ticket => ticket.status.toLowerCase() === data.title.toLowerCase());
    else if (group === 'priority'){
        // console.log(level)
        filteredTickets = tickets.filter(ticket => ticket.priority === level);
        // console.log(filteredTickets)
    }else
        filteredTickets = tickets.filter(ticket => ticket.userId === userId);

    // Sort tickets based on order
    if (order === 'priority')
        filteredTickets = filteredTickets.slice().sort((a, b) => b.priority - a.priority);
    else
        filteredTickets = filteredTickets.slice().sort((a, b) => a.title.localeCompare(b.title));

    const handleAddTicket = (e) => {
        e.preventDefault();
        if (newTicket.title && newTicket.priority && newTicket.status && newTicket.userId) {
            const ticketToAdd = {
                id: `CAM-${tickets.length+1}`, 
                title: newTicket.title,
                priority: parseInt(newTicket.priority),
                status: newTicket.status,
                userId: newTicket.userId
            };
            onAddTicket(ticketToAdd); // Call the function passed via props to add the ticket
            setNewTicket({ title: '', priority: '', status: '', userId: '' }); // Reset form
            setShowForm(false); // Hide form after submission
        }
    };

    if (group === 'user') {
        return (
            <div className='board'>
                <div className='board_top'>
                    <div className="board_top_name">
                        <span><UserIcon intials={generateIntials(data?.name)} available={data?.available} bgColor={getRandomColor()} /></span>
                        <p>{data?.name} </p>
                        <span>{filteredTickets.length}</span>
                    </div>
                    <div className="board_top_options">
                        <Add onClick={() => setShowForm(prev => !prev)}/>
                        <DotDotDot />
                    </div>
                </div>
                {showForm && (
                <form onSubmit={handleAddTicket} className="add-ticket-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        required
                    />
                    <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        required
                    >
                        <option value="">Select Priority</option>
                        {priorities.map((priority, index) => (
                            <option key={index} value={index}>{priority.title}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.status}
                        onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                        required
                    >
                        <option value="">Select Status</option>
                        {Object.keys(statusIcons).map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.userId}
                        onChange={(e) => setNewTicket({ ...newTicket, userId: e.target.value })}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button type="submit">Add Ticket</button>
                </form>
            )}
                <div className="board_container">
                    {
                        filteredTickets.map((ticket) => {
                            return (<Card
                                ticket={ticket}
                                key={ticket.id}
                                icon={priorities[ticket?.priority].icon}
                                group={group} statusIcon={statusIcons[ticket?.status.toLowerCase()].icon}
                                statusColor={statusIcons[ticket?.status.toLowerCase()].color}
                                bgColor={getRandomColor()}
                            />)
                        })
                    }
                </div>

            </div>
        )
    }
    if (group === 'priority') {
        return (
            <div className='board'>
                <div className='board_top'>
                    <div className="board_top_name">
                        <span style={{ color: data.color }}>{data.icon}</span>
                        <p>{data.title} </p>
                        <span>{filteredTickets.length}</span>
                    </div>
                    <div className="board_top_options">
                        <Add onClick={() => setShowForm(prev => !prev)}/>
                        <DotDotDot />
                    </div>
                </div>
                {showForm && (
                <form onSubmit={handleAddTicket} className="add-ticket-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        required
                    />
                    <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        required
                    >
                        <option value="">Select Priority</option>
                        {priorities.map((priority, index) => (
                            <option key={index} value={index}>{priority.title}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.status}
                        onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                        required
                    >
                        <option value="">Select Status</option>
                        {Object.keys(statusIcons).map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.userId}
                        onChange={(e) => setNewTicket({ ...newTicket, userId: e.target.value })}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button type="submit">Add Ticket</button>
                </form>
            )}
                <div className="board_container">
                    {
                        filteredTickets.map((ticket) => {
                            const user = users?.find(user => user.id === ticket.userId)
                            return (<Card
                                ticket={ticket}
                                key={ticket.id}
                                user={user}
                                group={group}
                                statusIcon={statusIcons[ticket?.status.toLowerCase()].icon}
                                statusColor={statusIcons[ticket?.status.toLowerCase()].color}
                                bgColor={getRandomColor()}
                                icon="" />)
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='board'>
            <div className='board_top'>
                <div className="board_top_name">
                    <span style={{color: data.color}}>{data.icon}</span>  
                    <p>{data?.title} </p>
                    <span>{filteredTickets.length}</span>
                </div>
                <div className="board_top_options">
                    <Add  onClick={() => setShowForm(prev => !prev)}/> {/* Toggle form visibility */}
                    <DotDotDot />
                </div>
            </div>
            {showForm && (
                <form onSubmit={handleAddTicket} className="add-ticket-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        required
                    />
                    <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        required
                    >
                        <option value="">Select Priority</option>
                        {priorities.map((priority, index) => (
                            <option key={index} value={index}>{priority.title}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.status}
                        onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
                        required
                    >
                        <option value="">Select Status</option>
                        {Object.keys(statusIcons).map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={newTicket.userId}
                        onChange={(e) => setNewTicket({ ...newTicket, userId: e.target.value })}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button type="submit">Add Ticket</button>
                </form>
            )}
            <div className='tickets'>
                {filteredTickets.map((ticket) => {
                        const user = users?.find(user => user.id === ticket.userId)
                        return (<Card
                            ticket={ticket}
                            key={ticket.id}
                            statusIcon=""
                            icon={priorities[ticket?.priority].icon}
                            user={user}
                            group={group}
                            bgColor={getRandomColor()}
                            statusColor="" />)
                })}
            </div>
        </div>
    );
};

export default Dashboard;