import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import AddressGroup from "src/database/models/AddressGroup";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            id,
        } = req.body;
        if (id) {
            // Create new one and update
            // Need to create new only
            try {
                let group = AddressGroup.findById(id);
                await group.remove();
                return res.status(200).send("deleted");
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);