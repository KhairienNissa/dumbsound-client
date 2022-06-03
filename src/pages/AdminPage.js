import React, { useContext, useEffect, useState } from 'react'

import NavbarAdmin from '../components/admin/NavbarAdmin'
import { API } from '../config/api'

export default function AdminPage () {

    let api = API()
    
    const [users, setUsers] = useState()
    const [transactions, setTransactions] = useState();

    const getUsers = async () => {
        const config = {
            method: 'GET',
            headers: {
                Authorization: "Basic " + localStorage.token,
            } 
        };
        const response = await api.get('/users', config)
        setUsers(response.getData)
    }
    
    const getTransactions = async () => {
        const response = await api.get('/transactions')
        console.log(response);
        setTransactions(response.transactions)
        console.log(transactions);
    }
    
    useEffect(() => { 
        getUsers()
        getTransactions()
    }, [])

    // Set Duration
    const remainingActive = (startDate, dueDate, idTransaction, idUser) => {
        if (!startDate && !dueDate) {
            return 0;
        }

        const date1 = new Date();
        const date2 = new Date(dueDate);
        const Difference_In_Time = date2.getTime() - date1.getTime();
        const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        // Jika Masa aktif telah habis
        if (Difference_In_Days === 0) {
        // Delete Transaction
            const deleteTransaction = async () => {
                try {
                    const config = {
                        method: 'DELETE',
                        headers: {
                            Authorization: "Basic " + localStorage.token,
                            "Content-type": "application/json",
                        },
                    };

                    // Delete Transaction
                    await api.delete("transaction/" + idTransaction, config);

                    let setStatusPayment = {
                        setStatusPayment: "Not Active",
                    };

                    setStatusPayment = JSON.stringify(setStatusPayment);

                    await API.patch("user/" + idUser,setStatusPayment, config);
                } catch (error) {
                    console.log(error);
                }
            };
            deleteTransaction();
            return 0;
        }
        return Difference_In_Days;
    };
    

    return(
        <>
            <div className="admin-container text-white">
                <NavbarAdmin />
                <div className='d-flex flex-column height-90 mt-md-5 p-10 px-3 px-xl-4 list-users'>
                    <h2 className='my-4 fs-sans table-users-header'>Incoming Transaction</h2>
                    <table class="table table-dark table-striped fs-6">
                        <thead className="text-orange">
                            <tr>
                                <th className="col p-3">No</th>
                                <th className="col p-3">Users</th>
                                <th className="col p-3">Remaining Active</th>
                                <th className="col p-3">Status User</th>
                                <th className="col p-3">Status Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions?.map((item, index) => (
                            <tr className='table-users'>
                                <th scope="row" className='p-3'>{index + 1}</th>
                                <td className='p-3'>{item.user.fullName}</td>
                                <td className='p-3 text-green'>{remainingActive(item?.startDate, item?.dueDate, item.id, item.user?.id)}/Hari
                                </td>
                                {item?.status === "success" ?
                                    <td className='p-3 text-green'>Active</td> : 
                                    <td className='p-3 text-red'>unActvie</td>
                                }
                                {item?.status === "success" ?
                                    <td className='p-3 text-green'>{item.status}</td> : 
                                item?.status === "pending" ?
                                    <td className='p-3 text-yellow'>{item.status}</td> :
                                    <td className='p-3 text-white'>-</td>
                                }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}