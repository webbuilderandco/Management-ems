import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './admin.css';

const emptyStudent = { name: '', studentId: '', className: 'SS 1 · Science', email: '' };

function Logo() {
  return <div className="admin-brand"><img src="/emmanuel-logo.svg" alt="Emmanuel Senior Secondary School"/><div><strong>EMMANUEL</strong><span>Administration Portal</span></div></div>;
}

function AdminApp() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState('Overview');
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStudent);

  useEffect(() => onAuthStateChanged(auth, async current => {
    setUser(current);
    if (!current) { setIsAdmin(false); setAuthLoading(false); return; }
    try {
      const profile = await getDoc(doc(db, 'users', current.uid));
      setIsAdmin(profile.exists() && profile.data().role === 'Admin');
    } catch { setIsAdmin(false); }
    setAuthLoading(false);
  }), []);

  useEffect(() => {
    if (!isAdmin) return;
    return onSnapshot(collection(db, 'students'), snapshot => {
      setStudents(snapshot.docs.map(item => ({ key: item.id, ...item.data() })));
    }, () => setError('Unable to load students. Check Firestore rules.'));
  }, [isAdmin]);

  const visibleStudents = useMemo(() => students.filter(student =>
    `${student.name || ''} ${student.studentId || student.id || ''} ${student.className || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [students, search]);

  async function login(event) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    try { await signInWithEmailAndPassword(auth, data.get('email'), data.get('password')); }
    catch (e) { setError(e.code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Sign-in failed.'); }
  }

  async function logout() { await signOut(auth); }

  function openAdd() { setEditing(null); setForm(emptyStudent); setModal(true); }
  function openEdit(student) { setEditing(student); setForm({ name: student.name || '', studentId: student.studentId || student.id || '', className: student.className || 'SS 1 · Science', email: student.email || '' }); setModal(true); }

  async function saveStudent(event) {
    event.preventDefault();
    try {
      const payload = { ...form, name: form.name.trim(), studentId: form.studentId.trim(), email: form.email.trim(), status: 'Active', updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, 'students', editing.key), payload);
      else await addDoc(collection(db, 'students'), { ...payload, createdAt: serverTimestamp() });
      setModal(false); setEditing(null); setForm(emptyStudent);
    } catch (e) { setError('Could not save student. Check Firestore permissions.'); }
  }

  async function removeStudent(student) {
    if (!window.confirm(`Delete ${student.name || 'this student'}?`)) return;
    try { await deleteDoc(doc(db, 'students', student.key)); }
    catch { setError('Could not delete student. Check Firestore permissions.'); }
  }

  if (authLoading) return <main className="loading-admin">Loading administration portal…</main>;

  if (!user || !isAdmin) return (
    <main className="admin-login">
      <section className="login-card">
        <Logo />
        <div className="login-title"><span>SECURE ADMIN ACCESS</span><h1>Welcome, Administrator</h1><p>Sign in with an authorized Emmanuel administrator account.</p></div>
        <form onSubmit={login} className="login-form">
          <label>Admin email<input name="email" type="email" placeholder="admin@emmanuel.edu" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" placeholder="Enter password" autoComplete="current-password" required /></label>
          {error && <div className="login-error">{error}</div>}
          <button type="submit">Sign in to Admin <b>→</b></button>
        </form>
        <div className="login-footer">Authorized personnel only · Emmanuel Senior Secondary School</div>
      </section>
    </main>
  );

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Logo />
      <div className="workspace"><span>ADMIN WORKSPACE</span><b>Emmanuel Secondary</b></div>
      <nav>{['Overview','Students','Teachers','Attendance','Results','Timetable','Resources'].map(item => <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)}><span className="nav-symbol">{item === 'Overview' ? '◫' : item === 'Students' ? '♙' : item === 'Teachers' ? '♟' : item === 'Attendance' ? '✓' : item === 'Results' ? '▥' : item === 'Timetable' ? '▦' : '◇'}</span>{item}</button>)}</nav>
      <div className="admin-profile"><img src="/emmanuel-logo.svg" alt=""/><div><b>{user.email}</b><span>Administrator</span></div><button onClick={logout} title="Sign out">↪</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-header"><div><span>SCHOOL ADMINISTRATION</span><b>{section}</b></div><div className="header-actions"><span className="term">Current academic year</span></div></header>
      <div className="admin-content">
        {section === 'Overview' ? <>
          <div className="admin-heading"><div><span>ADMINISTRATION</span><h1>Administration Overview</h1><p>Manage your school operations and records.</p></div><button className="primary-admin" onClick={openAdd}>＋ Add student</button></div>
          <section className="admin-stats"><article><span className="stat-icon purple">♙</span><div><span>Total students</span><strong>{students.length}</strong><small>Live Firestore records</small></div></article><article><span className="stat-icon green">♟</span><div><span>Teaching staff</span><strong>—</strong><small>Staff module</small></div></article><article><span className="stat-icon orange">✓</span><div><span>Attendance today</span><strong>—</strong><small>Register module</small></div></article><article><span className="stat-icon blue">▥</span><div><span>Reports</span><strong>—</strong><small>Academic module</small></div></article></section>
          <section className="admin-card student-card"><div className="card-heading"><div><span>STUDENT MANAGEMENT</span><h2>Student records</h2></div><button onClick={() => setSection('Students')}>View all →</button></div>{students.length === 0 ? <div className="feature-placeholder"><h3>No student records yet</h3><p>Add the first student using the Add student button.</p></div> : <StudentTable students={students.slice(0, 8)} onEdit={openEdit} onDelete={removeStudent}/>}</section>
        </> : <section className="admin-card management-card">
          <div className="card-heading"><div><span>ADMINISTRATION</span><h2>{section}</h2></div>{section === 'Students' && <button className="primary-admin" onClick={openAdd}>＋ Add student</button>}</div>
          {section === 'Students' ? <><div className="search-row"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search students, IDs or classes…"/><span>{visibleStudents.length} records</span></div>{visibleStudents.length ? <StudentTable students={visibleStudents} onEdit={openEdit} onDelete={removeStudent}/> : <div className="feature-placeholder"><h3>{search ? 'No matching records' : 'No student records yet'}</h3><p>{search ? 'Try a different search.' : 'Use Add student to create the first record.'}</p></div>}</> : <div className="feature-placeholder"><h3>{section} management</h3><p>This module is available for Firebase data integration.</p></div>}
        </section>}
      </div>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setModal(false)}><form className="admin-modal" onSubmit={saveStudent}><div className="modal-head"><h2>{editing ? 'Edit student' : 'Add student'}</h2><button type="button" onClick={() => setModal(false)}>×</button></div><label>Full name<input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Student name" required /></label><label>Student ID<input value={form.studentId} onChange={e => setForm({...form, studentId:e.target.value})} placeholder="EMS-2026-001" required /></label><label>Email<input value={form.email} onChange={e => setForm({...form, email:e.target.value})} type="email" placeholder="student@emmanuel.edu" /></label><label>Class<select value={form.className} onChange={e => setForm({...form, className:e.target.value})}><option>SS 1 · Science</option><option>SS 1 · Business</option><option>SS 2 · Science</option><option>SS 2 · Arts</option><option>SS 3 · Science</option><option>SS 3 · Arts</option></select></label>{error && <div className="login-error">{error}</div>}<button className="primary-admin modal-submit" type="submit">{editing ? 'Save changes' : 'Add student'}</button></form></div>}
  </div>;
}

function StudentTable({students, onEdit, onDelete}) {
  return <div className="student-table full-table"><div className="table-head"><span>STUDENT</span><span>STUDENT ID</span><span>CLASS</span><span>STATUS</span><span>ACTIONS</span></div>{students.map(student => <div className="table-row" key={student.key}><div className="student-name"><i>{(student.name || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</i><b>{student.name || 'Unnamed student'}</b></div><span>{student.studentId || student.id || '—'}</span><span>{student.className || '—'}</span><span className="active-status">● {student.status || 'Active'}</span><span className="row-actions"><button onClick={() => onEdit(student)}>Edit</button><button className="delete-action" onClick={() => onDelete(student)}>Delete</button></span></div>)}</div>;
}

createRoot(document.getElementById('admin-root')).render(<AdminApp />);
