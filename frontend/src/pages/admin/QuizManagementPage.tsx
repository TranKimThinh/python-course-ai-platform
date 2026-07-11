import { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

// Dữ liệu mẫu (Mock data) bóc từ HTML
const mockQuizzes = [
  {
    id: "QZ01",
    title: "Quiz 01 - Giới thiệu Python",
    course: "Python Cơ Bản",
    lesson: "Bài 1: Giới thiệu",
    questions: 10,
    duration: "15 phút",
    attempts: 420,
    totalStudents: 500,
    avgScore: "8.2/10",
    status: "active",
    date: "12/03/2024",
    icon: "description",
    iconBg: "bg-primary-container text-primary",
    passRate: 70
  },
  {
    id: "QZ04",
    title: "Quiz 04 - Vòng lặp trong Python",
    course: "Python Cơ Bản",
    lesson: "Bài 4: Vòng lặp",
    questions: 15,
    duration: "20 phút",
    attempts: 286,
    totalStudents: 350,
    avgScore: "7.6/10",
    status: "active",
    date: "21/03/2024",
    icon: "analytics",
    iconBg: "bg-primary text-white",
    passRate: 70
  },
  {
    id: "QZ02",
    title: "Kiểm tra chương 2 - Cấu trúc điều khiển",
    course: "Python Cơ Bản",
    lesson: "Chương 2",
    questions: 25,
    duration: "30 phút",
    attempts: 154,
    totalStudents: 200,
    avgScore: "7.9/10",
    status: "draft",
    date: "02/04/2024",
    icon: "folder_open",
    iconBg: "bg-surface-container-high text-on-surface-variant",
    passRate: 65
  }
];

export default function QuizManagementPage() {
  // --- STATE QUẢN LÝ BỘ LỌC TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // --- STATE QUẢN LÝ FORM AI ---
  const [aiLesson, setAiLesson] = useState("Vòng lặp For/While");
  const [aiCount, setAiCount] = useState<number>(10);
  const [aiLevel, setAiLevel] = useState("Trung bình");

  // Lấy danh sách khóa học duy nhất để cho vào Dropdown
  const uniqueCourses = useMemo(() => Array.from(new Set(mockQuizzes.map(q => q.course))), []);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredQuizzes = useMemo(() => {
    return mockQuizzes.filter(quiz => {
      const matchSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCourse = courseFilter === "" || quiz.course === courseFilter;
      const matchStatus = statusFilter === "" || quiz.status === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [searchTerm, courseFilter, statusFilter]);

  // --- STATE CHỌN QUIZ: Mặc định là null (không chọn bài nào) ---
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // Không tự động gán quiz đầu tiên nữa. Nếu id là null thì selectedQuiz cũng là null
  const selectedQuiz = selectedQuizId ? filteredQuizzes.find(q => q.id === selectedQuizId) || null : null;

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleResetFilters = () => {
    setSearchTerm("");
    setCourseFilter("");
    setStatusFilter("");
  };

  const handleGenerateAI = () => {
    alert(`Đang xử lý: Tạo ${aiCount} câu hỏi (${aiLevel}) cho bài học "${aiLesson}"...`);
  };

  const handleDummyAction = (actionName: string) => {
    alert(`Chức năng "${actionName}" đang được phát triển!`);
  };

  // Hàm render trạng thái
  const renderStatus = (status: string) => {
    if (status === 'active') {
      return (
        <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[12px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang hoạt động
        </span>
      );
    }
    return (
      <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[12px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Bản nháp
      </span>
    );
  };

  return (
    <AdminLayout>
      <div
        className="p-6 space-y-6 w-full min-h-screen overflow-x-hidden"
        style={{ zoom: "0.8" }}
      >
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">Quản lý Quiz</h2>
            <p className="text-on-surface-variant text-base">Tạo, chỉnh sửa và theo dõi các bài kiểm tra trong từng khóa học.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleDummyAction("Lọc nâng cao")} className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">filter_alt</span> Lọc nâng cao
            </button>
            <button onClick={() => handleDummyAction("Xuất báo cáo")} className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">file_download</span> Xuất báo cáo
            </button>
            <button onClick={() => handleDummyAction("Ngân hàng câu hỏi")} className="px-5 py-2.5 bg-white border border-outline-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span> Ngân hàng câu hỏi
            </button>
            <button onClick={() => handleDummyAction("Tạo Quiz mới")} className="px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Tạo Quiz mới
            </button>
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <span className="flex items-center text-[#0058be] text-sm font-bold">+8% <span className="material-symbols-outlined text-[16px] ml-1">trending_up</span></span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Tổng số Quiz</p>
            <h3 className="text-2xl font-bold mt-1 text-on-surface">86</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 rounded-xl text-green-600">
                <span className="material-symbols-outlined">toggle_on</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Quiz đang hoạt động</p>
            <h3 className="text-2xl font-bold mt-1 text-on-surface">64</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl text-yellow-700">
                <span className="material-symbols-outlined">database</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Câu hỏi trong ngân hàng</p>
            <h3 className="text-2xl font-bold mt-1 text-on-surface">1,245</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/50 group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <span className="material-symbols-outlined">history_edu</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Lượt làm bài tháng này</p>
            <h3 className="text-2xl font-bold mt-1 text-on-surface">3,820</h3>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU & CHI TIẾT */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* Left: Table & Toolbar - Nếu không có selectedQuiz thì chiếm full chiều rộng */}
          <div className={`${selectedQuiz ? "lg:w-2/3" : "w-full"} min-w-0 flex flex-col gap-6 transition-all duration-300`}>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-outline-variant/50 shadow-sm flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">search</span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="Tìm theo tên quiz..."
                  type="text"
                />
              </div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">Tất cả Khóa học</option>
                {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-base focus:ring-primary focus:border-primary outline-none"
              >
                <option value="">Tất cả Trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="draft">Bản nháp</option>
              </select>

              <button onClick={handleResetFilters} title="Khôi phục bộ lọc" className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors">
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
            </div>

            {/* Quiz Management Table */}
            <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low/50">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Tên Quiz</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Khóa học</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Nội dung</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Trạng thái</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant whitespace-nowrap">Ngày tạo</th>
                      <th className="px-4 py-4 text-sm font-semibold text-on-surface-variant"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {filteredQuizzes.length > 0 ? (
                      filteredQuizzes.map((quiz) => {
                        const isSelected = selectedQuiz?.id === quiz.id;
                        return (
                          <tr
                            key={quiz.id}
                            onClick={() => setSelectedQuizId(quiz.id)}
                            className={`transition-colors cursor-pointer group ${isSelected
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : "hover:bg-surface border-l-4 border-transparent"
                              }`}
                          >
                            <td className="px-4 py-4 min-w-[220px]">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${quiz.iconBg}`}>
                                  <span className="material-symbols-outlined text-[20px]">{quiz.icon}</span>
                                </div>
                                <div className="whitespace-nowrap">
                                  <p className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{quiz.title}</p>
                                  <p className="text-xs text-on-surface-variant">{quiz.questions} câu hỏi | {quiz.duration}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2.5 py-1 bg-surface-container text-on-surface rounded-full text-xs font-medium whitespace-nowrap">{quiz.course}</span>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-on-surface whitespace-nowrap">{quiz.lesson}</p>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {renderStatus(quiz.status)}
                            </td>
                            <td className="px-4 py-4 text-on-surface-variant text-sm whitespace-nowrap">{quiz.date}</td>
                            <td className="px-4 py-4 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDummyAction("Tùy chọn khác"); }} className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-sm text-on-surface-variant italic">
                          Không tìm thấy Quiz nào phù hợp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 bg-white border-t border-outline-variant/30 flex items-center justify-between mt-auto">
                <p className="text-sm text-on-surface-variant">
                  Hiển thị <span className="font-bold">{filteredQuizzes.length}</span> bài quiz
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40" disabled={filteredQuizzes.length === 0}><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  <button className="w-8 h-8 bg-primary text-white rounded-lg font-bold">1</button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40" disabled={filteredQuizzes.length === 0}><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Detail Panel - CHỈ HIỂN THỊ KHI CÓ selectedQuiz */}
          {selectedQuiz && (
            <div className="lg:w-1/3 min-w-0 space-y-6 shrink-0">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/50 shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold text-on-surface">Chi tiết Quiz</h4>
                    {selectedQuiz.status === 'active' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Hoạt động</span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Bản nháp</span>
                    )}
                  </div>
                  {/* NÚT TẮT CHI TIẾT QUIZ */}
                  <button onClick={() => setSelectedQuizId(null)} className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-md hover:bg-error-container/50">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h5 className="text-primary font-bold text-lg leading-tight mb-2">{selectedQuiz.title}</h5>
                    <p className="text-on-surface-variant text-sm mb-1">Khóa học: <span className="font-semibold text-on-surface">{selectedQuiz.course}</span></p>
                    <p className="text-on-surface-variant text-sm">Bài học: <span className="font-semibold text-on-surface">{selectedQuiz.lesson}</span></p>
                  </div>
                  <hr className="border-outline-variant/30" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-on-surface-variant text-[12px] font-medium">Số câu hỏi</p>
                      <p className="text-lg font-bold text-on-surface">{selectedQuiz.questions} câu</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-on-surface-variant text-[12px] font-medium">Thời gian</p>
                      <p className="text-lg font-bold text-on-surface">{selectedQuiz.duration}</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-on-surface-variant text-[12px] font-medium">Điểm đạt</p>
                      <p className="text-lg font-bold text-on-surface">{selectedQuiz.passRate}%</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl">
                      <p className="text-on-surface-variant text-[12px] font-medium">Điểm TB</p>
                      <p className="text-lg font-bold text-[#0058be]">{selectedQuiz.avgScore}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-on-surface">Lượt làm bài</span>
                      <span className="text-primary font-bold text-sm">{selectedQuiz.attempts} / {selectedQuiz.totalStudents} học viên</span>
                    </div>
                    <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(selectedQuiz.attempts / selectedQuiz.totalStudents) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleDummyAction("Chỉnh sửa Quiz")} className="col-span-2 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span> Chỉnh sửa Quiz
                  </button>
                  <button onClick={() => handleDummyAction("Danh sách Câu hỏi")} className="py-2.5 bg-surface-container text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all text-sm">
                    <span className="material-symbols-outlined text-[20px]">list_alt</span> Câu hỏi
                  </button>
                  <button onClick={() => handleDummyAction("Ẩn Quiz")} className="py-2.5 bg-surface-container text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all text-sm">
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span> Ẩn Quiz
                  </button>
                  <button onClick={() => handleDummyAction("Kết quả chi tiết")} className="col-span-2 py-2.5 bg-[#0058be] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0058be]/90 transition-all mt-2 text-sm">
                    <span className="material-symbols-outlined text-[20px]">bar_chart_4_bars</span> Xem kết quả chi tiết
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
