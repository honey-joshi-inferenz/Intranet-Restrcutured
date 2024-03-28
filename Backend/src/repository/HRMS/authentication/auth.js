require("dotenv").config();
const { SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { Op } = require("sequelize");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(SECRET_KEY);
const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();
const { connection_hrms } = require("../../../../config/dbConfig");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../../../middleware/authorization");
const { v4: uuidv4 } = require("uuid");

function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sendEmail(receiverEmail, subject, msgBody) {
  var transporter = nodemailer.createTransport({
    // service: 'office',
    host: "outlook.office365.com",
    port: 587,
    secure: false,
    // tls: { rejectUnauthorized: false },

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: receiverEmail,
    subject: subject,
    text: msgBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// It will register new user into the system.
const addUserAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      var userRole = req.body.role;
      var allowedRoles = ["Employee", "Interviewer"];
      var tempPassword;
      if (allowedRoles.includes(userRole)) {
        tempPassword = cryptr.encrypt("");
      } else {
        const charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{}|;:,.<>?";
        const charactersLength = charset.length;
        let randomString = "";

        for (let i = 0; i < 8; i++) {
          randomString += charset.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        tempPassword = cryptr.encrypt(randomString);
        // tempPassword = cryptr.encrypt(req.body.password);
      }

      const data = {
        uuid: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        emp_code: req.body.emp_code,
        dept_name: req.body.dept_name,
        manager_name: req.body.manager_name,
        role: userRole,
        password: tempPassword,
        is_temp_password: allowedRoles.includes(userRole) ? false : true,
        visible: true,
      };

      var user = await models.users.findOne({
        where: { email: data.email, role: data.role },
      });
      if (user) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: "User already exist!!",
        });
      } else {
        user = await models.users.create(data);

        const allowedRoles = ["HR", "Admin", "Accounts"];
        var subject, msgBody;
        if (allowedRoles.includes(data.role) && !req.body.selfRegistration) {
          var compName = "Inferenz Tech Private Limited";
          // var subject = "Get  access to your Recruiter portal";
          subject = "Inferenz Tech Private Limited Recruiter Portal Access";
          msgBody =
            "Dear " +
            data.name +
            ",\n\nI hope this message finds you in good spirits.\n\nWe're thrilled to extend an invitation for you to join the Inferenz Tech Private Limited recruiter portal. This platform serves as a centralized resource, tailored to optimize your experience within our organization.\n\nLogin Credentials : \n\nRecruiter Portal : https://intranet.inferenz.ai\nTemporary Password : " +
            cryptr.decrypt(data.password) +
            "\n\nWe encourage you to explore the diverse range of modules available on the portal at your convenience. If you encounter any challenges or have inquiries, please do not hesitate to reach out to us for assistance.\n\nBest Regards,\nTeam HR.";
        } else if (
          !allowedRoles.includes(data.role) &&
          req.body.selfRegistration
        ) {
          subject = "Welcome to Our Intranet Portal!";
          msgBody =
            "Dear " +
            data.name +
            ",\n\nCongratulations on completing your registration for our Intranet portal! Get ready to experience the seamless integration of convenience and efficiency in one central hub.\n\nWelcome to a platform that hosts our Reimbursement, Refer-a-Buddy, and Intra-Sell modules, all designed to streamline various aspects of our operations. Additionally, interviewers will find easy access to their interview-related data, enhancing their workflow and productivity.\n\nThank you for joining us on this journey!\n\nBest Regards,\nTeam HR";
        } else if (
          !allowedRoles.includes(data.role) &&
          !req.body.selfRegistration
        ) {
          subject = "Inferenz Tech Private Limited Recruiter Portal Access";
          msgBody =
            "Dear " +
            data.name +
            ",\n\nI hope this message finds you in good spirits.\n\nWe're thrilled to extend an invitation for you to join the Inferenz Tech Private Limited recruiter portal. This platform serves as a centralized resource, tailored to optimize your experience within our organization.\n\nRecruiter Portal : https://intranet.inferenz.ai\n\nWe encourage you to explore the diverse range of modules available on the portal at your convenience. If you encounter any challenges or have inquiries, please do not hesitate to reach out to us for assistance.\n\nBest Regards,\nTeam HR.";
        }
        sendEmail(data.email, subject, msgBody);

        return res.status(200).json({
          status: true,
          code: 200,
          message: "User registered successfully.",
          data: user,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will check weather the credentials are correct or not provided by user.
const userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      var { email, role, password } = req.body;

      var user = await models.users.findOne({
        where: { email, role },
      });
      if (user) {
        var allowedRoles = ["Employee", "Interviewer"];
        let token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: "1w",
        });

        if (allowedRoles.includes(role)) {
          res.status(200).json({
            status: true,
            code: 200,
            message: "Login Successful.",
            uuid: user.dataValues.uuid,
            role: user.dataValues.role,
            name: user.dataValues.name,
            email: user.dataValues.email,
            emp_code: user.dataValues.emp_code,
            dept_name: user.dataValues.dept_name,
            token,
          });
        } else {
          if (cryptr.decrypt(user.dataValues.password) === password) {
            res.status(200).json({
              status: true,
              code: 200,
              message: "Login Successful.",
              data: user.dataValues,
              // uuid: user.dataValues.uuid,
              // role: user.dataValues.role,
              // name: user.dataValues.name,
              // email: user.dataValues.email,
              // emp_code: user.dataValues.emp_code,
              // dept_name: user.dataValues.dept_name,
              token,
            });
          } else {
            return res.status(401).json({
              status: false,
              code: 401,
              message: "Invalid credentials!!",
            });
          }
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will check weather user is registered or not if user registered then it will send OTP to user's email address.
const sendOTP = async (req, res) => {
  var { email, role } = req.body;
  var otp, subject, body;

  try {
    if (email.split("@")[1] === "inferenz.ai") {
      var user = await models.users.findOne({
        where: { email },
      });
      let token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1w",
      });

      if (user) {
        otp = betweenRandomNumber(1000, 9999);
        if (role) {
          subject = "OTP to reset your password for Inferenz Intranet Portal";
          body =
            "Hi " +
            user.dataValues.name +
            "," +
            "\n\nPlease find below your OTP to reset your password for Inferenz Intranet Portal:\n\nOTP: " +
            otp +
            "\n\nRegards,\nAdmin";
        } else {
          subject = "OTP to access Inferenz Intranet Portal";
          body =
            "Hi " +
            user.dataValues.name +
            "," +
            "\n\nPlease find below your One Time Password (OTP) to log into Inferenz Intranet Portal:\n\nOTP: " +
            otp +
            "\n\nRegards,\nAdmin";
        }
        sendEmail(email, subject, body);
        res.status(200).json({
          status: true,
          code: 200,
          message: "OTP sent successfully.",
          otp,
          data: user,
          token,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Please enter your organization email!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will update the password of particular user's profile.
const changePassword = async (req, res) => {
  try {
    const { uuid, newPassword } = req.body;

    var user = await models.users.findOne({
      where: { uuid },
    });
    if (user) {
      const [updated] = await models.users.update(
        { password: cryptr.encrypt(newPassword), is_temp_password: false },
        {
          where: { uuid },
        }
      );
      if (updated) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Password changed successfully.",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "User does not exist!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will return complete profile of all users.
const getAllUserAccounts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      var users = await models.users.findAll({
        order: [["id", "DESC"]],
      });

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          users[i] = { serialNumber: i + 1, ...users[i].dataValues };
        }
        return res.status(200).json({
          status: true,
          code: 200,
          totalUsers: users.length,
          data: users,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will return complete profile of active users.
const getActiveUserAccounts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      var users = await models.users.findAll({
        where: { visible: true },
        order: [["id", "DESC"]],
      });

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          users[i] = { serialNumber: i + 1, ...users[i].dataValues };
        }
        return res.status(200).json({
          status: true,
          code: 200,
          totalUsers: users.length,
          data: users,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch soft deleted data of all users.
const getInActiveUserAccounts = async (req, res) => {
  try {
    const users = await models.users.findAll({
      where: { visible: false },
      order: [["id", "DESC"]],
    });

    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        users[i] = { serialNumber: i + 1, ...users[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        totalUsers: users.length,
        data: users,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        totalUsers: users.length,
        message: "Inactive users does not exist!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will return complete profile of user based on id.
const getUserAccountById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { uuid } = req.query;
      var user = await models.users.findOne({
        where: { uuid },
      });

      if (user) {
        var password = user.dataValues.password;
        if (password != null && password != "") {
          user.dataValues.password = cryptr.decrypt(password);
        }
        return res.status(200).json({
          status: true,
          code: 200,
          data: user,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will update the user profile.
const updateUserAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { uuid, password, email } = req.body;
      const today = new Date().toISOString().split("T")[0];
      var otp, subject, body;

      if (password) {
        req.body.password = cryptr.encrypt(password);
      }
      var user = await models.users.findOne({
        where: { uuid },
      });

      if (user) {
        await models.users.update(req.body, {
          where: { uuid },
        });

        if (user.dataValues.role !== req.body.role) {
          subject = "Update: Your Intranet Role Enhancement";
          body =
            "Dear " +
            user.dataValues.name +
            "," +
            "\n\nExciting news! We're delighted to announce that your role on our Intranet has been upgraded to " +
            req.body.role +
            ", effective " +
            today +
            ". This advancement grants you enhanced privileges and expanded access within our system.\n\nIf you have any inquiries or require support, don't hesitate to contact our HR Team. We're here to assist you every step of the way.\n\nThank you for your ongoing commitment to our organization.\n\nBest Regards,\nTeam HR";

          sendEmail(email, subject, body);
        }

        var updatedUser = await models.users.findOne({
          where: { uuid },
        });

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Profile updated successfully.",
          data: updatedUser,
        });
      } else {
        return res.status(401).json({
          status: false,
          code: 401,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will update the visiblity status of particular user profile from database. (HIDE)
const deleteUserAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { uuid } = req.query;
      var user = await models.users.findOne({
        where: { uuid },
      });
      if (user) {
        const [updated] = await models.users.update(
          { visible: false },
          {
            where: { uuid },
          }
        );
        if (updated) {
          return res.status(200).json({
            status: true,
            code: 200,
            message: "User profile deleted successfully.",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will make one user with higher role instead of storing same user with different roles.
const deleteDuplicateUserAccounts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameters missing!!",
        data: errors.array(),
      });
    } else {
      var deletedUsers = [];
      var allUsers = await models.users.findAll();

      if (allUsers) {
        for (let i = 0; i < allUsers.length; i++) {
          var duplicateUsers = await models.users.findAll({
            where: {
              email: allUsers[i].dataValues.email,
            },
          });

          if (!deletedUsers.includes(allUsers[i].dataValues.email)) {
            var roleOrders = [
              "Admin",
              "Accounts",
              "HR",
              "Interviewer",
              "Employee",
            ];

            let userWithDesiredRole;

            // Find the user with the highest-priority role
            for (let role of roleOrders) {
              userWithDesiredRole = duplicateUsers.find(
                (user) => user.dataValues.role === role
              );

              if (userWithDesiredRole) {
                break;
              }
            }

            if (userWithDesiredRole) {
              var uuid = userWithDesiredRole.dataValues.uuid;
              var email = userWithDesiredRole.dataValues.email;

              // Delete users with lower-priority roles
              for (let user of duplicateUsers) {
                if (
                  user.dataValues.role !== userWithDesiredRole.dataValues.role
                ) {
                  await models.users.destroy({
                    where: { email, uuid: { [Op.ne]: uuid } },
                  });
                  deletedUsers.push(user.dataValues.email);
                }
              }
            }
          }

          if (i + 1 == allUsers.length) {
            return res.status(200).json({
              status: true,
              code: 200,
              message: "Duplicate users deleted successfully.",
            });
          }
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

router.get("/encryptUserDetails", (req, res) => {
  try {
    // const sqlQ = 'SELECT id, final_remarks FROM interviewer_candidate'
    // connection_hrms.query(sqlQ, function (err, data) {
    //     if (err) throw err
    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].final_remarks === null || data[i].final_remarks === '') {
    //             const sql = 'UPDATE interviewer_candidate SET final_remarks = ? where id = ?'
    //             connection_hrms.query(sql, [cryptr.encrypt(''), data[i].id],
    //                 function (err, data) {
    //                     if (err) {
    //                         console.log(err)
    //                         res.status(400).json({ status: 400, message: 'Request Failed!!' })
    //                     }
    //                 }
    //             )
    //         }
    //         if (data[i].final_remarks != null && data[i].final_remarks != '') {
    //             const sql = 'UPDATE interviewer_candidate SET final_remarks = ? where id = ?'
    //             console.log(cryptr.encrypt(data[i].final_remarks))
    //             connection_hrms.query(sql, [cryptr.encrypt(data[i].final_remarks), data[i].id],
    //                 function (err, data) {
    //                     if (err) {
    //                         console.log(err)
    //                         res.status(400).json({ status: 400, message: 'Request Failed!!' })
    //                     }
    //                 }
    //             )
    //         }
    //     }
    // })
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: 400, message: "Interanl Server Error occured!!" });
  }
});

// It will update all users status to TRUE.
router.get("/updateUserVisiblity", (req, res) => {
  try {
    const sql = "UPDATE users SET visible = true";
    connection_hrms.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Request Failed!!" });
      }
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: 400, message: "Interanl Server Error occured!!" });
  }
});

// It will add UUID for all users.
router.get("/addUUID", (req, res) => {
  try {
    const sql = "SELECT * FROM users";
    connection_hrms.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Request Failed!!" });
      } else {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let userID = uuidv4();
            const sql = "UPDATE users SET uuid = ? WHERE id = ?";
            connection_hrms.query(
              sql,
              [userID, data[i].id],
              function (err, data) {
                if (err) {
                  console.log(err);
                  res
                    .status(400)
                    .json({ status: 400, message: "Request Failed!!" });
                }
              }
            );

            if (i + 1 == data.length) {
              //Update in interviewer_candidate
              const sql = "SELECT * FROM interviewer_candidate";
              connection_hrms.query(sql, function (err, candidateData) {
                if (err) {
                  console.log(err);
                  res
                    .status(400)
                    .json({ status: 400, message: "Request Failed!!" });
                } else {
                  if (candidateData.length > 0) {
                    for (let j = 0; j < candidateData.length; j++) {
                      let userID = uuidv4();
                      const sql =
                        "UPDATE interviewer_candidate SET uuid = ? WHERE id = ?";
                      connection_hrms.query(
                        sql,
                        [userID, candidateData[j].id],
                        function (err, data) {
                          if (err) {
                            console.log(err);
                            res.status(400).json({
                              status: 400,
                              message: "Request Failed!!",
                            });
                          }
                        }
                      );

                      if (j + 1 == candidateData.length) {
                        res.status(200).json({
                          status: 200,
                          message: "UUID Updated Successfully.",
                        });
                      }
                    }
                  }
                }
              });
            }
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: 400, message: "Interanl Server Error occured!!" });
  }
});

module.exports = {
  addUserAccount,
  userLogin,
  sendOTP,
  changePassword,
  getAllUserAccounts,
  getActiveUserAccounts,
  getInActiveUserAccounts,
  getUserAccountById,
  updateUserAccount,
  deleteUserAccount,
  deleteDuplicateUserAccounts,
};
