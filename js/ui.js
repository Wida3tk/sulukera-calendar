export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

export async function hasAdminAccess(user) {
  if (!user) return false;
  try {
    return (await user.getIdTokenResult()).claims.admin === true;
  } catch (error) {
    console.error("Could not verify admin access", error);
    return false;
  }
}

export function phaseScheduleKey(programId, phase, index) {
  return `${programId}_${phase.id ?? index}`;
}
