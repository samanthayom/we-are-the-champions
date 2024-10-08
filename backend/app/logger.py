import logging
import sys


class CustomLogger(logging.Logger):
    def __init__(self, name: str, level: int = logging.INFO):
        super().__init__(name, level)
    
    def success(self, message: str):
        self.info(message)

    def error(self, message: str, exc_info: bool = True):
        super().error(message, exc_info=exc_info)


logging.setLoggerClass(CustomLogger)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)

def get_logger(name: str) -> CustomLogger:
    return logging.getLogger(name)


