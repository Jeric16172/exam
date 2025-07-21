import { useStudentForm } from "@/hooks/useStudentForms";

export default function StudentForm() {
  const { form, handleChange, handleSubmit } = useStudentForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="Enter your first name"
        className="input-class"
      />
      <input
        type="text"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Enter your last name"
      />
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Choose a username"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
      />
      <input
        type="text"
        name="contact"
        value={form.contact}
        onChange={handleChange}
        placeholder="09xxxxxxxxx"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
