// Base URL for the Storypath RESTful API
const API_BASE_URL = "https://0b5ff8b0.uqcloud.net/api";

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ3NDAxMDUifQ.1M6gRJ4C0OX-npBLoJFF9CfmMy3Oxq-c-fMdxShnmGw";

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = "s4740105";

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      "Content-Type": "application/json", // Indicate that we are sending JSON data
      Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token for authentication
    },
  };

  // // If the method is POST or PATCH, we want the response to include the full representation
  if (method === "POST" || method === "PATCH") {
    options.headers["Prefer"] = "return=representation";
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // console.log(body);

  // Make the API request and check if the response is OK
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (response.status === 204) {
    return null;
  }
  if (!response.ok) {
    // console.log(`HTTP error! status: ${await response.text()}`);
    throw new Error(`HTTP error! status: ${await response.text()}`);
  }

  // Return the response as a JSON object
  return response.json();
}

/**
 * Function to insert a new project into the database.
 *
 * @param {object} project - The project data to insert.
 * @returns {Promise<object>} - The created project object returned by the API.
 */
export async function createProject(project) {
  return apiRequest("/project", "POST", project);
}

/**
 * Function to update the existing project.
 *
 * @param {object} project - The project data to update.
 * @param {string} id - The associated project that need to be updated.
 * @returns {Promise<object>} - The updated project object returned by the API.
 */
export async function updateProject(id, project) {
  return apiRequest(`/project?id=eq.${id}`, "PATCH", project);
}

/**
 * Function to list all projects associated with the current user.
 *
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getProjects() {
  return apiRequest("/project");
}

/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

/**
 * Delete associated project.
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object that was deleted.
 */
export async function deleteProject(id) {
  return apiRequest(`/project?id=eq.${id}`, "DELETE");
}

/**
 * Function to insert a new location into the database.
 *
 * @param {object} location - The location data to insert.
 * @returns {Promise<object>} - The created location object returned by the API.
 */
export async function createLocation(location) {
  return apiRequest("/location", "POST", location);
}

/**
 * Function to list all locations associated with the current user.
 *
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getLocations() {
  return apiRequest("/location");
}

/**
 * Function to get a single location by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
export async function getLocation(id) {
  return apiRequest(`/location?id=eq.${id}`);
}

/**
 * Function to update the existing location.
 *
 * @param {object} location - The location data to update.
 * @param {string} id - The associated location that need to be updated.
 * @returns {Promise<object>} - The updated location object returned by the API.
 */
export async function updateLocation(id, location) {
  return apiRequest(`/location?id=eq.${id}`, "PATCH", location);
}

/**
 * Delete associated location.
 * @param {string} id - The ID of the location to retrieve.
 * @returns {Promise<object>} - The location object that was deleted.
 */
export async function deleteLocation(id) {
  return apiRequest(`/location?id=eq.${id}`, "DELETE");
}

/**
 * Function to list all tracking associated with the current user.
 *
 * @returns {Promise<Array>} - An array of project objects.
 */
export async function getTracking() {
  return apiRequest(`/tracking`);
}

/**
 * Get number of participants in that project
 * @param {string} project_id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The participant count object matching the ID.
 */
export async function getParticipantCount(project_id) {
  return apiRequest(`/project_participant_counts?project_id=eq.${project_id}`);
}

/**
 * Get number of participants visited in that location
 * @param {string} location_id - The ID of the location to retrieve.
 * @returns {Promise<object>} - The participant count object matching the ID.
 */
export async function getLocationParticipantCount(location_id) {
  return apiRequest(
    `/location_participant_counts?location_id=eq.${location_id}`
  );
}

/**
 * Function to insert a new tracking into the database.
 *
 * @param {object} tracking - The tracking data to insert.
 * @returns {Promise<object>} - The created tracking object returned by the API.
 */
export async function createTracking(tracking) {
  return apiRequest("/tracking", "POST", tracking);
}
