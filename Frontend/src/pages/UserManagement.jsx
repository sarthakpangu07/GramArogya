
import { useState, useEffect, useCallback } from "react";
import "./UserManagement.css";

const USERS_API = "https://gramarogya-27q3.onrender.com/api/users";

const initialStaffForm = {
    name: "",
    email: "",
    password: "",
    role: "phc_staff"
};

const roleLabels = {
    patient: "Patient",
    phc_staff: "PHC Staff",
    doctor: "Doctor",
    specialist: "Specialist",
    admin: "Admin"
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString();
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [staffForm, setStaffForm] = useState(initialStaffForm);

    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch users from the protected admin API
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Your admin session has expired. Please log in again.");
            }

            const params = new URLSearchParams({
                page: String(page),
                limit: "10"
            });

            if (search) {
                params.set("search", search);
            }

            if (role !== "all") {
                params.set("role", role);
            }

            const response = await fetch(
                `${USERS_API}?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Unable to fetch users."
                );
            }

            if (!Array.isArray(data?.users)) {
                throw new Error("Invalid user list received from server.");
            }

            setUsers(data.users);

            setPagination(
                data.pagination || {
                    total: data.users.length,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            );
        } catch (err) {
            setError(
                err.message || "Something went wrong while fetching users."
            );
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, role, refreshKey]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setRole("all");
        setPage(1);
        setSuccess("");
        setRefreshKey((current) => current + 1);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setStaffForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    // Create PHC staff, doctor or specialist account
    const handleCreateStaff = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        try {
            setCreating(true);

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Your admin session has expired. Please log in again.");
            }

            const response = await fetch(`${USERS_API}/staff`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: staffForm.name.trim(),
                    email: staffForm.email.trim(),
                    password: staffForm.password,
                    role: staffForm.role
                })
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Unable to create staff account."
                );
            }

            setSuccess(
                `${roleLabels[staffForm.role]} account created successfully.`
            );

            setStaffForm(initialStaffForm);
            setShowCreateForm(false);

            setSearchInput("");
            setSearch("");
            setRole("all");
            setPage(1);
            setRefreshKey((current) => current + 1);
        } catch (err) {
            setError(
                err.message || "Something went wrong while creating the account."
            );
        } finally {
            setCreating(false);
        }
    };

    const handlePreviousPage = () => {
        setPage((current) => Math.max(1, current - 1));
    };

    const handleNextPage = () => {
        setPage((current) =>
            Math.min(pagination.totalPages, current + 1)
        );
    };

    return (
        <div className="user-management">
            <section className="user-management-heading">
                <div>
                    <span className="admin-eyebrow">
                        ACCOUNT ADMINISTRATION
                    </span>

                    <h2>User Management</h2>

                    <p>
                        View registered users and create healthcare staff
                        accounts.
                    </p>
                </div>

                <button
                    type="button"
                    className="user-create-button"
                    onClick={() => {
                        setShowCreateForm((current) => !current);
                        setError("");
                        setSuccess("");
                    }}
                >
                    {showCreateForm ? "Close form" : "+ Create staff"}
                </button>
            </section>

            {success && (
                <div className="user-alert user-alert-success" role="status">
                    {success}
                </div>
            )}

            {error && (
                <div className="user-alert user-alert-error" role="alert">
                    {error}
                    <button
                        type="button"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        Retry
                    </button>
                </div>
            )}

            {showCreateForm && (
                <section className="user-create-panel">
                    <div className="user-panel-heading">
                        <div>
                            <span className="admin-eyebrow">
                                NEW STAFF ACCOUNT
                            </span>
                            <h3>Create healthcare staff account</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateStaff}>
                        <div className="user-form-grid">
                            <div className="user-form-field">
                                <label htmlFor="staff-name">Full name</label>
                                <input
                                    id="staff-name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={staffForm.name}
                                    onChange={handleFormChange}
                                    minLength={2}
                                    maxLength={100}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="user-form-field">
                                <label htmlFor="staff-email">Email address</label>
                                <input
                                    id="staff-email"
                                    name="email"
                                    type="email"
                                    placeholder="staff@example.com"
                                    value={staffForm.email}
                                    onChange={handleFormChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="user-form-field">
                                <label htmlFor="staff-password">Temporary password</label>
                                <input
                                    id="staff-password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    value={staffForm.password}
                                    onChange={handleFormChange}
                                    minLength={8}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="user-form-field">
                                <label htmlFor="staff-role">Account role</label>
                                <select
                                    id="staff-role"
                                    name="role"
                                    value={staffForm.role}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="phc_staff">PHC Staff</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="specialist">Specialist</option>
                                </select>
                            </div>
                        </div>

                        <p className="user-form-note">
                            Specialist facility assignment will be handled
                            through the Specialist Assignments module.
                        </p>

                        <button
                            className="user-create-submit"
                            type="submit"
                            disabled={creating}
                        >
                            {creating ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </section>
            )}

            <section className="user-list-panel">
                <div className="user-list-toolbar">
                    <form
                        className="user-search-form"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="search"
                            placeholder="Search by name or email..."
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            aria-label="Search users by name or email"
                        />

                        <button type="submit" disabled={loading}>
                            Search
                        </button>
                    </form>

                    <select
                        className="user-role-filter"
                        value={role}
                        onChange={(event) => {
                            setPage(1);
                            setRole(event.target.value);
                        }}
                        aria-label="Filter users by role"
                    >
                        <option value="all">All roles</option>
                        <option value="patient">Patients</option>
                        <option value="phc_staff">PHC Staff</option>
                        <option value="doctor">Doctors</option>
                        <option value="specialist">Specialists</option>
                        <option value="admin">Admins</option>
                    </select>

                    <button
                        type="button"
                        className="user-clear-button"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </button>
                </div>

                <div className="user-list-summary">
                    <strong>{pagination.total} users</strong>
                    <span>
                        {role === "all" ? "All account types" : roleLabels[role]}
                        {search ? ` · Search: "${search}"` : ""}
                    </span>
                </div>

                {loading ? (
                    <div className="user-empty-state" role="status">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="user-empty-state">
                        <strong>No users found</strong>
                        <p>Try changing your search or role filter.</p>
                    </div>
                ) : (
                    <div className="user-table-wrapper">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Facility</th>
                                    <th>Joined</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-table-person">
                                                <span className="user-table-avatar">
                                                    {(user.name || "U")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                                <strong>{user.name}</strong>
                                            </div>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span className={`user-role-tag role-${user.role}`}>
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                        </td>

                                        <td>
                                            {user.assignedFacility?.name || "—"}
                                        </td>

                                        <td>{formatDate(user.createdAt)}</td>

                                        <td>
                                            <button
                                                type="button"
                                                className="user-details-button"
                                                onClick={() =>
                                                    setSelectedUser(user)
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && pagination.totalPages > 0 && (
                    <div className="user-pagination">
                        <span>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>

                        <div>
                            <button
                                type="button"
                                onClick={handlePreviousPage}
                                disabled={page <= 1}
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={handleNextPage}
                                disabled={page >= pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {selectedUser && (
                <div
                    className="user-modal-backdrop"
                    onClick={() => setSelectedUser(null)}
                    role="presentation"
                >
                    <section
                        className="user-details-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="user-details-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="user-modal-heading">
                            <div>
                                <span className="admin-eyebrow">
                                    USER INFORMATION
                                </span>
                                <h3 id="user-details-title">Account details</h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                aria-label="Close user details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="user-detail-row">
                            <span>Name</span>
                            <strong>{selectedUser.name}</strong>
                        </div>

                        <div className="user-detail-row">
                            <span>Email</span>
                            <strong>{selectedUser.email}</strong>
                        </div>

                        <div className="user-detail-row">
                            <span>Role</span>
                            <strong>
                                {roleLabels[selectedUser.role] || selectedUser.role}
                            </strong>
                        </div>

                        <div className="user-detail-row">
                            <span>Assigned facility</span>
                            <strong>
                                {selectedUser.assignedFacility?.name || "Not assigned"}
                            </strong>
                        </div>

                        <div className="user-detail-row">
                            <span>Joined</span>
                            <strong>{formatDate(selectedUser.createdAt)}</strong>
                        </div>

                        <div className="user-modal-note">
                            Password information is never displayed.
                        </div>

                        <button
                            type="button"
                            className="user-create-submit"
                            onClick={() => setSelectedUser(null)}
                        >
                            Close
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
