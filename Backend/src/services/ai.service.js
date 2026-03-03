const { Groq } = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { jsonrepair } = require("jsonrepair");
const puppeteer = require("puppeteer");

const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),

  matchScore: z
    .number()
    .describe(
      "The match score between the candidate and the job description, on a scale of 0 to 100",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),
        answer: z
          .string()
          .describe(
            "how to answer this question, what points to cover in the answer, what approach to take while answering the question, etc...",
          ),
      }),
    )
    .describe(
      "The list of technical questions that can be asked in the interview",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview"),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking the question",
          ),
        answer: z
          .string()
          .describe(
            "how to answer this question, what points to cover in the answer, what approach to take while answering this question, etc...",
          ),
      }),
    )
    .describe(
      "The list of behavioral questions that can be asked in the interview",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill in which the candidate is lacking and needs improvement",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap"),
      }),
    )
    .describe(
      "The list of skill gaps that the candidate has along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number of the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The focus area for the day, e.g., 'Data Structures', 'System Design', 'Behavioral Questions', etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "The list of tasks to be completed on that day, e.g., 'Solve 5 LeetCode problems', 'Read about microservices architecture', 'Practice STAR method for behavioral questions', etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to improve their skills and prepare for the interview based on the identified skill gaps and the questions that can be asked in the interview",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert career coach. Based on the following resume, self description and job description, generate a comprehensive interview report for the candidate. The report should include:
  1. Match Score: A score between 0 to 100 indicating how well the candidate matches the job description.
  2. Technical Questions: A list of technical questions that can be asked in the interview, along with the intention behind each question and how to answer it.(minimum 10 questions)
  3. Behavioral Questions: A list of behavioral questions that can be asked in the interview, along with the intention behind each question and how to answer it.(minimum 10 questions)
  4. Skill Gaps: A list of skills that the candidate is lacking and needs improvement on, along with the severity of each skill gap (low, medium, high).
  5. Preparation Plan: A day-wise preparation plan for the candidate to improve their skills and prepare for the interview based on the identified skill gaps and the questions that can be asked in the interview.
  6. Title: The title of the job for which the interview report is generated.
 

  The response should be in JSON format and should adhere to the following schema:
  Return EXACTLY this JSON structure:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ],
  "title": string
}

DO NOT:
- Put field names inside arrays
- Flatten objects
- Split fields into separate arrays
- Return strings where objects are required

Rules:
- Each question must be an object with question, intention, and answer fields.
- preparationPlan must be an array of objects.
- Return only valid JSON.

 Resume: ${resume}
  Self Description: ${selfDescription}
  Job Description: ${jobDescription}
`;

  const completion = await ai.chat.completions.create({
    model: "groq/compound",
    messages: [
      {
        role: "system",
        content: "You are a strict JSON generator. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const rawText = completion.choices[0].message.content;
  try {
    const fixed = jsonrepair(rawText);
    const json = JSON.parse(fixed);
    parsed = interviewReportSchema.parse(json);
  } catch (err) {
    console.error("Invalid JSON from Groq:", rawText);
    throw new Error("AI returned invalid structured JSON");
  }
  return parsed;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
}

async function generateResumepdf(resume, selfDescription, jobDescription) {
  const resumepdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume PDF file"),
  });

  const prompt = `Generate a resume for a candidate based on the following information:
  resume: ${resume},
  selfDescription: ${selfDescription},
  jobDescription: ${jobDescription}

  The resume should be in HTML format and should include the following sections:
  1. Contact Information: The candidate's name, email, phone number, and LinkedIn profile (if available).
  2. Summary: A brief summary of the candidate's background, skills, and career goals.
  3. Work Experience: A list of the candidate's previous work experiences, including the job title, company name, duration, and a brief description of the responsibilities and achievements for each role.(If present)
  4. Projects: A list of the candidate's relevant projects, including the project name, a brief description, and the technologies used.(If present)
  5. Education: A list of the candidate's educational qualifications, including the degree, institution name, and graduation year.
  6. Skills: A list of the candidate's relevant skills for the job they are applying for.

  the html should be well-structured and formatted, making use of appropriate HTML tags for headings, paragraphs, lists, etc. The design should be clean and professional, suitable for a resume. Avoid using inline styles; instead, use classes for styling. The content should be concise and relevant to the job description provided. and ensure that the resume highlights the candidate's strengths and suitability for the job they are applying for. and make sure to include all the relevant information from the resume and self-description while tailoring it to match the job description. and remember, the goal is to create a resume that effectively showcases the candidate's qualifications and makes them stand out to potential employers. and DO NOT include any information that is not relevant to the job description or that does not add value to the resume. and the resume should be tailored to the specific job description provided, emphasizing the candidate's most relevant skills and experiences. and the resume should be ATS-friendly, meaning it should be easily parsable by Applicant Tracking Systems used by many employers to screen resumes. This means avoiding complex formatting, graphics, and tables that may not be read correctly by ATS software. Instead, use a simple and clean layout with clear section headings and bullet points for easy readability. The resume should also include relevant keywords from the job description to increase the chances of passing through ATS filters.the resume should be concise, ideally fitting on one page, but can extend to two pages if the candidate has extensive relevant experience. The content should be clear and easy to read, with a focus on the candidate's achievements and qualifications that are most relevant to the job they are applying for. the resume should be able to effectively communicate the candidate's value proposition to potential employers, making it clear why they are a strong fit for the position based on their skills, experience, and qualifications.the resume should be visually appealing a well organized with a clear hierarchy of information, making it easy for hiring managers to quickly scan and identify key details about the candidate's background and qualifications. The design should be professional and modern, while still being appropriate for the industry and job level the candidate is targeting. Use of white space, consistent formatting, and a clean layout can help enhance the overall appearance of the resume and make it stand out to potential employers. Remember, the goal is to create a resume that not only effectively showcases the candidate's qualifications but also makes a strong visual impression that encourages hiring managers to take a closer look at their application.
  
  The response should be in JSON format and should adhere to the following schema:
  Return EXACTLY this JSON structure:

{
  "html": string
}

}
`;
  const completion = await ai.chat.completions.create({
    model: "groq/compound",
    messages: [
      {
        role: "system",
        content: "You are a strict JSON generator. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawText = completion.choices[0].message.content;

  try {
    const fixed = jsonrepair(rawText);
    const json = JSON.parse(fixed);
    parsed = resumepdfSchema.parse(json);
  } catch (err) {
    console.error("Invalid JSON from Groq:", rawText);
    throw new Error("AI returned invalid structured JSON");
  }
  
  const jsonContent = parsed;
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer; 
}

module.exports = { generateInterviewReport, generateResumepdf };
