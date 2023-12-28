import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Invoice from "src/database/models/Invoice";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            recipient,
            tokenAddress,
            items
        } = req.body;
        if (recipient && tokenAddress && items.length > 0) {
            try {
                let invoice = new Invoice(req.body);
                let savedInvoice = await invoice.save();
                return res.status(200).send(savedInvoice);
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