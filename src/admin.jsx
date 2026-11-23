import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './admin.css';

const initialStudents = [
  { id: 'EMS-2026-001', name: 'Ama Mensah', className: 'SS 2 · Science', status: 'Active' },
  { id: 'EMS-2026-002', name: 'Daniel Owusu', className: 'SS 2 · Science', status: 'Active' },
  { id: 'EMS-2026-003', name: 'Grace Boateng', className: 'SS 1 · Business', status: 'Active' },
  { id: 'EMS-2026-004', name: 'Samuel Asare', className: 'SS 3 · Arts', status: 'Active' },
];

function AdminApp() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('emmanuel-admin') === 'true');
  const [error, setError] = useState('');
  const [section, setSection] = useState('Overview');
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);

  function login(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('username') === 'emmanuel' && data.get('password') === 'emmanuel@123') {
      sessionStorage.setItem('emmanuel-admin', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid administrator username or password.');
    }
  }

  function logout() {
    sessionStorage.removeItem('emmanuel-admin');
    setAuthenticated(false);
  }

  function addStudent(event) {
    event.preventEvent;
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <section className="login-card">
          <div className="admin-brand"><div className="school-seal">E</div><div><strong>EMMANUEL</strong><span>Administration Portal</span></div></div>
          <div className="login-title"><span>SECURE ADMIN ACCESS</span><h1>Welcome, Administrator</h1><p>Sign in to manage the Emmanuel school system.</p></div>
          <form onSubmit={login} className="login-form">
            <label>Username<input name="username" placeholder="Enter username" autoComplete="username" required /></label>
            <label>Password<input name="password" type="password" placeholder="Enter password" autoComplete="current-password" required /></label>
            {error && <div className="login-error">{error}</div>}
            <button type="submit">Sign in to Admin <b>→</b></button>
          </form>
          <div className="login-footer">Authorized personnel only · Emmanuel Senior Secondary School</div>
        </section>
      </main>
    );
  }

  const visibleStudents = students.filter(student =>
    `${student.name} ${student.id} ${student.className}`.toLowerCase().includes(search.toLower())
  );

  function saveStudent(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStudents(current => [{
      id: data.get('id'),
      name: data.get('name'),
      className: data.get('className'),
      status: 'Active'
    }, ...current]);
    setModal(false);
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand sidebar-brand"><div className="school-seal">E</div><div><strong>EMMANUEL</strong><span>School Management</span></div></div>
        <div className="workspace"><span>ADMIN WORKSPACE</span><b>Emmanuel Secondary</b></div>
        <nav>
          {['Overview', 'Students', 'Teachers', 'Attendance', 'Results', 'Timetable', 'Resources'].map(item => (
            <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)}>
              <span className="nav-symbol">{item === 'Overview' ? '◫' : item === 'Students' ? '♙' : item === 'Teachers' ? '♟' : item === 'Attendance' ? '✓' : item === 'Results' ? '▥' : item === 'Timetable' ? '▦' : '◇'}</span>{item}
            </button>
          ))}
        </nav>
        <div className="admin-profile"><div className="profile-avatar">EA</div><div><b>Emmanuel Admin</b><span>System Administrator</span></div><button onClick={logout} title="Sign out">↪</button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-header"><div><span>SCHOOL ADMINISTRATION</span><b>{section}</b></div><div className="header-actions"><span className="term">2025 / 2026 · Term 2</span><button>● 3</button></div></header>
        <div className="admin-content">
          {section === 'Overview' ? (
            <>
              <div className="admin-heading"><div><span>MONDAY, 23 NOVEMBER 2026</span><h1>Administration Overview</h1><p>Manage your school operations and monitor today’s activity.</p></div><button className="primary-admin" onClick={() => setModal(true)}>＋ Add student</button></div>
              <section className="admin-stats">
                <article><span className="stat-icon purple">♙</span><div><span>Total students</span><strong>1,188</strong><small>+24 this term</small></div></article>
                <article><span className="stat-icon green">♟</span><div><span>Teaching staff</span><strong>46</strong><small>4 absent today</small></div></article>
                <article><span className="stat-icon orange">✓</span><div><span>Attendance today</span><strong>94.8%</strong><small>1,126 present</small></div></article>
                <article><span className="stat-icon blue">▥</span><div><span>Pending reports</span><strong>08</strong><small>2 need review</small></div></article>
              </section>
              <div className="admin-grid">
                <section className="admin-card student-card"><div className="card-heading"><div><span>STUDENT MANAGEMENT</span><h2>Recent students</h2></div><button onClick={() => setSection('Students')}>View all →</button></div><div className="student-table"><div className="table-head"><span>STUDENT</span><span>STUDENT ID</span><span>CLASS</span><span>STATUS</span></div>{students.slice(0,5).map(student => <div className="table-row" key={student.id}><div className="student-name"><i>{student.name.split(' ').map(n => n[0]).join('')}</i><b>{student.name}</b></div><span>{student.id}</span><span>{student.className}</span><span className="active-status">● Active</span></div>)}</div></section>
                <section className="admin-card activity-card"><div className="card-heading"><div><span>SCHOOL ACTIVITY</span><h2>Today</h2></div></div><div className="activity-list"><div><i className="green-dot"/><p><b>Attendance submitted</b><span>SS 2 Science · 9:42 AM</span></p></div><div><i className="orange-dot"/><p><b>Report awaiting review</b><span>SS 3 Arts · 8:15 AM</span></p></div><div><i className="purple-dot"/><p><b>Student record added</b><span>Admissions office · Yesterday</span></p></div></div></section>
              </div>
            </>
          ) : (
            <section className="admin-card management-card">
              <div className="card-heading"><div><span>ADMINISTRATION</span><h2>{section}</h2></div>{section === 'Students' && <button className="primary-admin" onClick={() => setModal(true)}>＋ Add student</button>}</div>
              {section === 'Students' ? <><div className="search-row"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search students, IDs or classes…"/><span>{visibleStudents.length} records</span></div><div className="student-table full-table"><div className="table-head"><span>STUDENT</span><span>STUDENT ID</span><span>CLASS</span><span>STATUS</span><span>ACTIONS</span></div>{visibleStudents.map(student => <div className="table-row" key={student.id}><div className="student-name"><i>{student.name.split(' ').map(n => n[0]).join('')}</i><b>{student.name}</b></div><span>{student.id}</span><span>{student.className}</span><span className="active-status">● {student.status}</span><button onClick={() => setStudents(current => current.filter(item => item.id !== student.id))}>Remove</button></div>)}</div></> : <div className="feature-placeholder"><div>◇</div><h3>{section} management</h3><p>This administration module is ready to connect to Firebase for live school data and secure role-based access.</p></div>}
            </section>
          )}
        </div>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setModal(false)}><form className="admin-modal" onSubmit={saveStudent}><div className="modal-head"><h2>Add student</h2><button type="button" onClick={() => setModal(false)}>×</button></div><label>Full name<input name="name" placeholder="Student name" required /></label><label>Student ID<input name="id" placeholder="EMS-2026-005" required /></label><label>Class<select name="className"><option>SS 1 · Science</option><option>SS 1 · Business</option><option>SS 2 · Science</option><option>SS 2 · Arts</option><option>SS 3 · Science</option><option>SS 3 · Arts</option></select></label><button className="primary-admin modal-submit" type="submit">Add student</button></form></div>}
    </div>
  );
}

createRoot(document.getElementById('admin-root')).render(<AdminApp />);
