const GENERAL_PROMPT = `
Below Given is the description of a website that I want to build.
I want to build this website in complete Next.js with complete TypeScript.
UI/UX should be very beautiful and attractive.
The website should be responsive and should work on all devices.
The website should contain as many features as possible.
Also, write complete backend code for the website as it is written in Next.js.
Treat this website as a complete full-stack project.
`;

export const STEP_GENERATION_PROMPT = (prompt: string) => `
${GENERAL_PROMPT}

Now, To accomplish all the above requirements,
I want you to generate set of detailed steps, following which a complete website as described can be built.

I wish to build website, as described below:
${prompt}

Give response with detailed steps to build the website.
`

export const CODE_GENERATION_PROMPT = (prompt: string, steps: string) => `
${GENERAL_PROMPT}

Now, To accomplish all the above requirements,
I want you to generate code for the website as described below:
${prompt}

Following are the detailed steps to build the website:
${steps}
`