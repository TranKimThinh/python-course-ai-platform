import { useState, useMemo, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

// Dữ liệu mẫu (Mock data)
const mockStudents = [
  {
    id: "SV-10922",
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "090 123 4567",
    joinDate: "12/01/2024",
    location: "Hồ Chí Minh, VN",
    course: "Python for AI Specialists",
    progress: 85,
    completedLessons: 17,
    totalLessons: 20,
    aiQuestions: 24,
    score: "8.5/10",
    aiCredit: 240,
    status: "active",
    avatarInitials: "NA",
    avatarBg: "bg-primary-container/20 text-primary",
  },
  {
    id: "SV-10923",
    name: "Trần Thị B",
    email: "thib@example.com",
    phone: "091 987 6543",
    joinDate: "05/02/2024",
    location: "Hà Nội, VN",
    course: "Advanced Machine Learning",
    progress: 45,
    completedLessons: 9,
    totalLessons: 20,
    aiQuestions: 12,
    score: "7.0/10",
    aiCredit: 120,
    status: "active",
    avatarInitials: "TB",
    avatarBg: "bg-pink-100 text-pink-600",
  },
  {
    id: "SV-10924",
    name: "Lê Minh C",
    email: "minhc@example.com",
    phone: "098 555 1122",
    joinDate: "15/03/2024",
    location: "Đà Nẵng, VN",
    course: "Generative AI Intro",
    progress: 10,
    completedLessons: 2,
    totalLessons: 20,
    aiQuestions: 3,
    score: "-/10",
    aiCredit: 50,
    status: "pending",
    avatarInitials: "MC",
    avatarBg: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "SV-10925",
    name: "Phạm Hoàng D",
    email: "hoangd@example.com",
    phone: "097 000 9988",
    joinDate: "01/01/2024",
    location: "Hải Phòng, VN",
    course: "N/A",
    progress: 0,
    completedLessons: 0,
    totalLessons: 20,
    aiQuestions: 0,
    score: "-/10",
    aiCredit: 0,
    status: "locked",
    avatarInitials: "HD",
    avatarBg: "bg-slate-200 text-slate-500",
  },
];

type Student = (typeof mockStudents)[number];

// Hàm hỗ trợ chuẩn hóa chuỗi (loại bỏ dấu tiếng Việt và chuyển thành chữ thường)
const removeAccents = (str: string) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export default function StudentManagementPage() {
  const [students] = useState(mockStudents);
  
  // --- STATES CHO TÌM KIẾM VÀ LỌC ---
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  
  // --- STATES CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Lấy danh sách khóa học duy nhất để đưa vào Select
  const uniqueCourses = useMemo(() => {
    const courses = students.map((s) => s.course).filter((c) => c !== "N/A");
    return Array.from(new Set(courses));
  }, [students]);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Kiểm tra tìm kiếm (Tìm không dấu, không phân biệt hoa thường)
      const normalizedSearch = removeAccents(appliedSearch);
      const matchSearch =
        removeAccents(student.name).includes(normalizedSearch) ||
        removeAccents(student.email).includes(normalizedSearch) ||
        removeAccents(student.phone).includes(normalizedSearch);

      // 2. Kiểm tra trạng thái
      const matchStatus = statusFilter === "all" || student.status === statusFilter;

      // 3. Kiểm tra khóa học
      const matchCourse = courseFilter === "all" || student.course === courseFilter;

      return matchSearch && matchStatus && matchCourse;
    });
  }, [students, appliedSearch, statusFilter, courseFilter]);

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    paginatedStudents[0] || null,
  );

  // Cập nhật lại Sidebar nếu data bị lọc khiến người đang chọn biến mất
  useEffect(() => {
    if (paginatedStudents.length > 0) {
      const isSelectedStillHere = paginatedStudents.find(s => s.id === selectedStudent?.id);
      if (!isSelectedStillHere) {
        setSelectedStudent(paginatedStudents[0]);
      }
    } else {
      setSelectedStudent(null);
    }
  }, [paginatedStudents, selectedStudent]);

  // Reset về trang 1 khi thay đổi điều kiện lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearch, statusFilter, courseFilter]);

  // --- HÀM XỬ LÝ SỰ KIỆN ---
  const handleSearch = () => {
    setAppliedSearch(searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setStatusFilter("all");
    setCourseFilter("all");
    setCurrentPage(1);
  };

  const handleAction = (actionName: string) => {
    alert(`Chức năng "${actionName}" sẽ được kết nối API sau.`);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">Đang hoạt động</span>;
      case "pending":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700">Chờ xác minh</span>;
      case "locked":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-error">Bị khóa</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Quản lý tài khoản học viên</h2>
            <p className="text-base text-on-surface-variant mt-1">Theo dõi tiến độ, tương tác AI và quản lý trạng thái tài khoản người học.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => handleAction('Xuất Excel')} className="flex items-center px-4 py-2 bg-surface text-primary border border-outline-variant hover:bg-surface-container-high transition-all rounded-lg text-sm font-medium">
              <span className="material-symbols-outlined text-lg mr-2">ios_share</span> Xuất Excel
            </button>
            <button type="button" onClick={() => handleAction('Lọc nâng cao')} className="flex items-center px-4 py-2 bg-surface text-primary border border-outline-variant hover:bg-surface-container-high transition-all rounded-lg text-sm font-medium">
              <span className="material-symbols-outlined text-lg mr-2">filter_alt</span> Lọc nâng cao
            </button>
            <button type="button" onClick={() => handleAction('Thêm học viên')} className="flex items-center px-5 py-2 bg-gradient-to-r from-primary to-[#0058be] text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all rounded-lg text-sm font-semibold">
              <span className="material-symbols-outlined text-lg mr-2">add_circle</span> Thêm học viên
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... (Giữ nguyên các khối Stats Bento) ... */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary-container/20 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">group</span>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">+4%</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Tổng học viên</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">{students.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-[24px]">check_circle</span>
              </div>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Đang hoạt động</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">{students.filter(s => s.status === 'active').length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-[24px]">lock</span>
              </div>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Đang bị khóa</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">{students.filter(s => s.status === 'locked').length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-[24px]">person_add</span>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-on-surface-variant text-sm font-medium">Mới tháng này</h3>
            <p className="text-2xl font-bold text-on-surface mt-1">128</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            
            {/* Filter Toolbar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Tìm kiếm</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                    <input 
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-base focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" 
                      placeholder="Tên, Email, SĐT..." 
                      type="text" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Trạng thái</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-lg text-base focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="pending">Chờ xác minh</option>
                    <option value="locked">Bị khóa</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Khóa học</label>
                  <select 
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-lg text-base focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none cursor-pointer"
                  >
                    <option value="all">Tất cả khóa học</option>
                    {uniqueCourses.map((course, idx) => (
                      <option key={idx} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
                  >
                    Tìm kiếm
                  </button>
                  <button 
                    type="button"
                    onClick={handleResetFilters}
                    title="Làm mới bộ lọc"
                    className="px-4 py-2 bg-surface border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30">
                      <th className="p-4 w-12"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" /></th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap">Học viên</th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap">Liên hệ</th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap">Khóa học & Tiến độ</th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap text-center">Hỏi AI</th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap">Trạng thái</th>
                      <th className="p-4 text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-base text-on-surface">
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-on-surface-variant italic">
                          Không tìm thấy học viên nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student) => {
                        const isSelected = selectedStudent?.id === student.id;
                        return (
                          <tr 
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className={`transition-colors cursor-pointer ${
                              isSelected 
                                ? "bg-primary-container/5 border-l-4 border-l-primary" 
                                : "hover:bg-surface-container-low border-l-4 border-transparent"
                            }`}
                          >
                            <td className="p-4">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                readOnly
                                className="rounded border-outline-variant text-primary focus:ring-primary" 
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${student.avatarBg}`}>
                                  {student.avatarInitials}
                                </div>
                                <div>
                                  <p className="font-bold text-on-surface">{student.name}</p>
                                  <p className="text-xs text-on-surface-variant">Tham gia: {student.joinDate}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-sm">{student.email}</p>
                              <p className="text-xs text-on-surface-variant">{student.phone}</p>
                            </td>
                            <td className="p-4 min-w-[200px]">
                              <p className="text-sm mb-1">{student.course}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${student.progress > 0 ? 'bg-primary' : 'bg-slate-300'}`} style={{ width: `${student.progress}%` }}></div>
                                </div>
                                <span className={`text-xs font-bold ${student.progress === 0 ? 'text-slate-400' : ''}`}>{student.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded font-bold text-sm ${student.aiQuestions > 0 ? 'bg-surface-container-high text-primary' : 'bg-surface-container-high text-slate-400'}`}>
                                {student.aiQuestions}
                              </span>
                            </td>
                            <td className="p-4">
                              {renderStatus(student.status)}
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleAction('Mở Menu Hành Động'); }}
                                className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant"
                              >
                                <span className="material-symbols-outlined text-lg">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredStudents.length > 0 && (
                <div className="p-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface">
                  <p className="text-sm text-on-surface-variant">
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredStudents.length)} trên {filteredStudents.length} học viên
                  </p>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button 
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded text-sm font-bold ${
                          currentPage === page 
                            ? "bg-primary text-white" 
                            : "hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button 
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-on-surface">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Student Detail Preview Panel */}
          <aside className="w-full lg:w-80 space-y-6">
            {selectedStudent ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/20 sticky top-24">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className={`w-24 h-24 rounded-full border-4 border-primary-container/20 flex items-center justify-center text-3xl font-bold mx-auto ${selectedStudent.avatarBg}`}>
                      {selectedStudent.avatarInitials}
                    </div>
                    {selectedStudent.status === 'active' && (
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-surface rounded-full"></span>
                    )}
                    {selectedStudent.status === 'locked' && (
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-red-500 border-2 border-surface rounded-full"></span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface mt-4">{selectedStudent.name}</h3>
                  <p className="text-sm text-on-surface-variant">Student ID: #{selectedStudent.id}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                    <span className="text-on-surface-variant">{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">phone_iphone</span>
                    <span className="text-on-surface-variant">{selectedStudent.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                    <span className="text-on-surface-variant">{selectedStudent.location}</span>
                  </div>
                </div>

                <div className="border-t border-outline-variant/30 pt-6 space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Tiến độ khóa học</span>
                      <span className="text-xs font-bold text-primary">{selectedStudent.completedLessons}/{selectedStudent.totalLessons} bài</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${selectedStudent.progress > 0 ? 'bg-primary' : 'bg-slate-300'}`} style={{ width: `${selectedStudent.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between p-3 bg-surface rounded-lg">
                    <div className="text-center flex-1 border-r border-outline-variant/30">
                      <p className="text-xs text-on-surface-variant uppercase">Điểm TB</p>
                      <p className="text-lg font-bold text-primary">{selectedStudent.score}</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-xs text-on-surface-variant uppercase">AI Credit</p>
                      <p className="text-lg font-bold text-[#0058be]">{selectedStudent.aiCredit}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-8">
                  <button type="button" onClick={() => handleAction('Xem hồ sơ chi tiết')} className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">person</span> Xem hồ sơ chi tiết
                  </button>
                  <button type="button" onClick={() => handleAction('Đặt lại mật khẩu')} className="w-full py-2 bg-surface border border-outline-variant text-on-surface-variant rounded-lg text-sm font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">lock_reset</span> Đặt lại mật khẩu
                  </button>
                  <button type="button" onClick={() => handleAction('Khóa tài khoản')} className="w-full py-2 bg-red-50 text-error border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">block</span> Khóa tài khoản
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                <p>Hãy chọn một học viên để xem chi tiết</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
