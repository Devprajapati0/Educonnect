import { loginSchema, signupSchema, uniqueSubdoamin } from "../schemas/institution.schema.js"
import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiResponse.js"
import { Institution } from "../models/institution.model.js"
import { stripe } from "../helpers/stripe.js"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import { generateAccessToken } from "../helpers/jwt.js"

const generateToken = async(instituteId) => {
  try {
    const instituteExisted = await Institution.findById(instituteId);
    if (!instituteExisted) {
      return res.json(
        new apiresponse(400, null, "Signup to have an account")
    );
    }
    // console.log("instituteExisted", instituteExisted)

    const institutetoken = generateAccessToken({
      _id: instituteExisted._id,
      username: instituteExisted.fullname,
      email: instituteExisted.email
    })

    // console.log("institutetoken", institutetoken)

    return institutetoken;
  } catch (error) {
    console.error("Error generating token:", error);
    return res.json(
      new apiresponse(500, null, "Server error during token generation")
    );
  }
}

const uniqueInstitutionSubdomain = asynhandler(async (req, res) => {
    try {
      console.log(req.body)
        const subDoaminSchema = uniqueSubdoamin.safeParse(req.body);
        if (!subDoaminSchema.success) {
            return res.json(
                new apiresponse(400, null, "Need subdomain")
            );
        }

        const { subdomain } = subDoaminSchema.data;

        const instituteExist = await Institution.findOne({ subdomain });

        if (instituteExist && instituteExist.subscription.isActive) {
            return res.json(
                new apiresponse(400, null, "Subdomain already exists")
            );
        }

        return res.json(
            new apiresponse(200, null, "Subdomain is available")
        );
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
            return res.json(new apiresponse(400, null, message));
        }
        return res.json(
            new apiresponse(500, null, "Error while verifying the subdomain")
        );
    }
});

const checkOutSession = asynhandler(async(req,res) => {
    try {
        const priceInPaise = Number(process.env.PRO_PLAN_PRICE); // CONVERT string to number!
       console.log(priceInPaise)
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'Pro Plan',
                  description: 'Access to all premium features for 1 year',
                },
                unit_amount: priceInPaise, 
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/cancel`,
          
        });
        console.log(session)
    
        return res.json(new apiresponse(200, session, "Session created successfully"));
      } catch (error) {
        console.error(error);
        return res.status(500).json(new apiresponse(500, null, "Something went wrong creating checkout session"));
      }
})

const checkoutSuccess = asynhandler(async(req,res) => {
    try {
        const {sessionid} = req.body
        console.log(sessionid)
        const session = await stripe.checkout.sessions.retrieve(sessionid)

        if(session.payment_status !== 'paid'){
            if(session)
            return res.json(
                new apiresponse(
                    400,
                    null,
                    "payment not successful"
                )
            )
        }

        return res.json(
            new apiresponse(
                200,
                session,
                "payment successful"
            )
        )
    } catch (error) {
        
    }
})

const institutionSignup = asynhandler(async (req, res) => {
  try {
    // Validate request body
    console.log(req.body);
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.json(new apiresponse(400, null, "All fields are required"));
    }

    const { fullname, email, password, subdomain,type,adminEmail, adminPassword,adminName,adminConfirmPassword,publickey,rollnumber  } =   parsedData.data;;

    // Check if institution already exists by email or subdomain
    const existingInstitution = await Institution.findOne({
      $or: [{ email }, { subdomain }]
    });

    let institution;

    if (existingInstitution) {
      if (existingInstitution.subscription?.isActive) {
        return res.json(new apiresponse(400, null, "Already have an active account"));
      } else {
        if(adminPassword !== adminConfirmPassword){
            return res.json(new apiresponse(400, null, "Password and confirm password do not match"));
        } 
        // Update existing institution details
        existingInstitution.fullname = fullname;
        existingInstitution.email = email;
        existingInstitution.password = await bcrypt.hash(password, 10);
        existingInstitution.subdomain = subdomain;
        existingInstitution.type = type;

        if (req.file) {
            const url = req.file.path || null;
            const photo = await uploadOnCloudinary(url);
            console.log("photo", photo)
            existingInstitution.logo = photo?.url || null; 
        }

        // Update existing admin user details
        const adminUser = await User.findById(existingInstitution.admin);
        if (adminUser) {
          adminUser.email = adminEmail;
          adminUser.password = await bcrypt.hash(adminPassword, 10);
          adminUser.name = adminName;
          adminUser.publickey = publickey;
          adminUser.rollnumber = rollnumber;
            adminUser.institution = {
                _id: existingInstitution._id,
                fullname: existingInstitution.fullname,
                email: existingInstitution.email,
                subdomain: existingInstitution.subdomain,
                subscription: existingInstitution.subscription,
                logo: existingInstitution.logo || null,
            };  
            
          await adminUser.save();
        }
        institution = await existingInstitution.save();
      }
    } else {
      // Create a new institution
      if(adminPassword !== adminConfirmPassword){
        return res.json(new apiresponse(400, null, "Password and confirm password do not match"));
    }
      const hashedInstitutionPassword = await bcrypt.hash(password, 10);
      let photo;
      if (req.file) {
        const url = req.file.path || null;
         photo = await uploadOnCloudinary(url);
         console.log("photo", photo)
    }
      const newInstitution = new Institution({
        fullname,
        email,
        password: hashedInstitutionPassword,
        subdomain,
        type,
        logo: photo?.url || null,
      });

      // Save institution first to generate _id
      await newInstitution.save();

      // Create admin user for the new institution
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      const newAdminUser = new User({
        institution: {
          _id: newInstitution._id,
          fullname: newInstitution.fullname,
          email: newInstitution.email,
          subdomain: newInstitution.subdomain,
          subscription: newInstitution.subscription,
          logo: newInstitution.logo,
        },
        email: adminEmail,
        password: hashedAdminPassword,
        name: adminName,
        role: "admin",
        publickey: publickey,
        rollnumber : rollnumber,
      });

      await newAdminUser.save();

      // Link admin user to institution
      newInstitution.admin = newAdminUser._id;
      institution = await newInstitution.save();
    }

    return res
      .json(new apiresponse(200, institution, "Account created successfully. Proceed to payment"));
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
      return res.json(new apiresponse(400, null, message));
    }

    return res.json(new apiresponse(500, null, "Error while creating institution"));
  }
});

const institutionLogin = asynhandler(async (req, res) => {
    try {
        const loginschema = loginSchema.safeParse(req.body);
        if (!loginschema.success) {
            return res.json(
                new apiresponse(400, null, "All fields are required")
            );
        }
        // console.log("dddddd",req.body)

        const { email, password, fullname } = loginschema.data;

        const institution = await Institution.findOne({email });

        if (!institution) {
            return res.json(
                new apiresponse(400, null, "No account found with this email and subdomain")
            );
        }
        

        const isMatch = await bcrypt.compare(password, institution.password);

        if (!isMatch) { 
            return res.json(
                new apiresponse(400, null, "Invalid credentials")
            );
        }
        if(institution.fullname !== fullname){
            return res.json(
                new apiresponse(400, null, "Invalid Institute name")
            );
        }

        if (!institution.subscription.isActive) {
            return res.json(
                new apiresponse(400, null, "Signup to have an account")
            );
        }
        // console.log("institution", institution)
        const institutetoken = await generateToken(institution._id);
        console.log("token",institutetoken)
        const options = {
          httpOnly: true,
          secure:true,
        }
        return res.cookie("institutetoken",institutetoken,options).json(
            new apiresponse(200, institution, "Login successful")
        );

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
            return res.json(new apiresponse(400, null, message));
        }
        return res.json(
            new apiresponse(500, null, "Server error during login")
        );
    }
});





export { uniqueInstitutionSubdomain,checkOutSession,checkoutSuccess,institutionSignup,institutionLogin }