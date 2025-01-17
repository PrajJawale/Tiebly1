import path from 'path'
import { Job } from '../schemas/jobs.model.js'
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, posotion, companyId } = req.body
        const userId = req.id

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !posotion || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            posotion,
            company: companyId,
            created_by: userId


        })

        return res.status(200).json({
            message: "New job created successfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }

            ]
        }
        const jobs = await Job.find(query).populate(
            {
                path:"company"
            }
        ).sort({createdAt:-1})
        if (!jobs) {
            return res.status(400).json({
                message: "Jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log("error in the found the jobs : ", error)
    }
}
//for student 
export const getJobById = async (req, res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"application"
        })
        if (!job) {
            return res.status(404).json({
                message: "Jobs Not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//for admin - job cretated by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "application", // Populate applications associated with the job
          })
          .populate({
            path: "company", // Populate company details for the job
          });
          
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs Not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}