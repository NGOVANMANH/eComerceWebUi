import React, { useState, useEffect } from 'react';
import Popup from '../../components/Popup';
import UserForm from '../../components/UserForm';
import Search from '../../components/Search';
import Image from '../../components/Image';
import { Pagination } from 'react-bootstrap';

const Users = () => {
    const [modalShow, setModalShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [recallid, setRecallid] = useState(1);
    const [paginations, setPaginations] = useState({
        total: 0,
        limit: 10,
        offset: 0,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:3010/api/users?limit=${paginations.limit}&offset=${paginations.offset}`);
                const data = await response.json();
                if (data.success) {
                    setUsers(data.data.users);
                    setPaginations(prev => ({
                        ...prev,
                        total: data.data.paginations.total,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, [recallid]);

    const handleClickItem = (id) => {
        setSelectedUser(id);
        setModalShow(true);
    };

    const reCallAfterAdd = () => {
        setRecallid(recallid + 1);
        setModalShow(false);
    };

    const handleLimitChange = (event) => {
        const newLimit = event.target.value ? +event.target.value : 10
        setPaginations(prev => ({ ...prev, limit: newLimit, offset: 0 }));
    };

    const handlePageChange = (newOffset) => {
        setPaginations(prev => ({ ...prev, offset: newOffset }));
        setRecallid(recallid + 1);
    };

    const totalPages = Math.ceil(paginations.total / paginations.limit);

    return (
        <div className='container'>
            <div className='d-flex align-items-center'>
                <button type="button" className="btn btn-secondary my-2" onClick={() => {
                    setModalShow(true);
                    setSelectedUser(null);
                }}>Add user</button>
                <Search className="ms-auto" />
            </div>
            <Popup
                title={selectedUser ? "Update user" : "Add user"}
                show={modalShow}
                onHide={() => setModalShow(false)}
                children={<UserForm callback={reCallAfterAdd} userId={selectedUser} />}
            />
            <table className="table table-hover table-bordered cursor-pointer">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Avatar</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone number</th>
                        <th scope="col">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, index) => (
                        <tr key={user.id} onClick={() => handleClickItem(user.id)}>
                            <th className='align-middle' scope="row">{paginations.offset + index + 1}</th>
                            <td className='align-middle'><Image src={user.avatar} alt={user.name} type="brand avatar" /></td>
                            <td className='align-middle'>{user.first_name}</td>
                            <td className='align-middle'>{user.last_name}</td>
                            <td className='align-middle'>{user.email}</td>
                            <td className='align-middle'>{user.phone_number}</td>
                            <td className='align-middle'>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='d-flex'>
                <input
                    type="number"
                    name="limit"
                    placeholder='Limit'
                    className='form form-control w-auto my-2'
                    value={paginations.limit}
                    onChange={handleLimitChange}
                />
                <button className='btn btn-secondary my-2 ms-2' onClick={() => setRecallid(recallid + 1)}>Set limit</button>
            </div>
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(0)} />
                <Pagination.Prev onClick={() => handlePageChange(Math.max(0, paginations.offset - paginations.limit))} />
                {[...Array(totalPages).keys()].map(page => (
                    <Pagination.Item
                        key={page}
                        active={page === Math.floor(paginations.offset / paginations.limit)}
                        onClick={() => handlePageChange(page * paginations.limit)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(Math.min((totalPages - 1) * paginations.limit, paginations.offset + paginations.limit))} />
                <Pagination.Last onClick={() => handlePageChange((totalPages - 1) * paginations.limit)} />
            </Pagination>
        </div>
    );
};

export default Users;
