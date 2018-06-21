 export const getApartments = () => {
    let apartments = [];
    let length = apartmentContract.getNumberOfApartments().toNumber();
    for(let i = 0; i < length; i++) {
        // apartmentContract.setIterator({from: currentUser});
        let tuple = apartmentContract.getApartmentInfo();
        let apartment = this.createApartment(tuple);
        apartments.push(apartment)
    }
    return apartments;
};

export const createApartment = (tuple) => {
    return {
        id: tuple[0].toNumber(),
        city: tuple[1],
        rent: tuple[2].toNumber(),
        deposit: tuple[3].toNumber()
    }
};

export const payRent = (apartment) => {
    console.log("Paying the rent...");
};