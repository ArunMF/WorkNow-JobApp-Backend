const companies = require('../models/companySchema');

// function to generate unique id for jobseeker and company
const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
        uniqueId = `COMP${Math.floor(Math.random() * 9999) + 1000}`; // 6-digit ID
        const exists = await companies.findOne({ companyId: uniqueId });
        if (!exists) {
            isUnique = true;
        }
    }
    return uniqueId;
}

// API to create company account
exports.companyRegister = async (req, res) => {
    const companyData = req.body;
    try {
        const checkCompany = await companies.findOne({ email: companyData.email });
        if (checkCompany) {
            if (checkCompany.statusOfRequest == "approved") {
                return res.status(404).json({ message: "This account already exists. Please log in instead." });
            } else if (checkCompany.statusOfRequest == "pending") {
                return res.status(401).json({ message: "This account is awaiting administrative approval. Please wait for a while. We will update you as soon as the process is complete." });
            }
        } else {
            const uniqueCompanyId = await generateUniqueId()
            // console.log(uniqueCompanyId);
            const newData = { companyId: uniqueCompanyId, ...companyData }

            const newCompany = new companies(newData)
            await newCompany.save()
            res.status(200).json({ message: "This account is awaiting administrative approval. Please wait for a while. We will update you as soon as the process is complete."});
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}