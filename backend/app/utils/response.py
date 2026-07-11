from typing import Any, Optional

def success_response(data: Any = None, message: str = "Thành công!"):
    """
    Hàm chuẩn hóa dữ liệu trả về khi API xử lý thành công.
    """
    return {
        "success": True,
        "message": message,
        "data": data
    }