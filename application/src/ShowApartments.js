import React, { Component } from 'react';

export class ShowApartments extends Component{
    handleChange = (apartment) => {
        let _apartment = apartment;
        // this.props.payRent(_apartment);
    }

    render() {
        let apartmentList = this.props.apartments.map((apartment, i) =>
        <tr key={apartment.id}>
            <td>{apartment.city}</td>
            <td>{apartment.rent}</td>
            <td>{apartment.deposit}</td>
        </tr>)

        return(
            <div>
                <h3>Apartments</h3>
                <hr/>
                <table>
                    <tbody>
                        <tr>
                            <th>City</th>
                            <th>Rent</th>
                            <th>Deposit</th> 
                        </tr>
                        {apartmentList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ShowApartments;