const  { objectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }
    // Định nghĩa các phương thức truy xuất  CSDL sử dụng mongodb API



    extractConactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };
        //  Remove undefined fields
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    async create(payload) {
        const contact = this. extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $sec: { favorite: contact.favorite === true}},
            { returnDocument: "after", upsert: true}

        ); 
        return result.value;
    }

    async find(filter){
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }
    async findByName (name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },

        });
    }
    async findById(id)  {
        return await this.Contact.findOne({
            _id: Object.isValid(id) ? new objectId(id) : null,

        });
    }

    async update(id, payload)  {
        const filter = {
            _id: Object.isValid(id) ? new Object(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            {returnDocument: "after"}

        );
        return result.value;
    }

    async delete(id) {
        const result = await thí.Contact.findOneAndUpdate({
            _id: Object.isValid(id) ? new Object(id) : null,
        });
        return result.value;
    }

    async findFavirite() {
        return await this.find({ favorite: true});
    }

    async deletedAll()  {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }



}

module.exports = ContactService;