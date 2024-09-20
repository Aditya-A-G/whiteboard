# Collaborative Whiteboard App

This is a simple whiteboard application built using React, Konva, and TypeScript. The application allows users to create, manipulate, and delete various shapes on a canvas in real-time. Users can select tools like rectangles, circles, arrows, or scribbles, and can also move and resize the drawn elements. Additionally, there is a functionality to download the canvas as an image.

## Live Demo

Check out the live version of the application [here](https://whiteboard.adityacodes.tech).


## Features

- **Tool Selection**: Choose between a cursor, rectangle, circle, arrow, and scribble tool.
- **Dynamic Shape Creation**: Draw rectangles, circles, arrows, or freehand lines on the whiteboard.
- **Element Manipulation**: Move, resize, and delete shapes.
- **Fill Colors**: Choose fill colors for shapes.
- **Download as Image**: Download the current canvas as a `.png` file.

## Tech Stack

- **Frontend**: React
- **Canvas Library**: Konva
- **Language**: TypeScript
- **UUID**: For generating unique IDs for each shape

## Supported Browsers

This application has been tested and is supported on the following browsers:

- Chrome
- Firefox
- Safari
  

## Installation

To run the project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/Aditya-A-G/whiteboard.git
    ```

2. Navigate to the project directory:

    ```bash
    cd whiteboard
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

This will start the application and open it in your default browser at `http://localhost:5173`.

## Usage

Once the application is running:

1. Use the toolbar at the top to select a tool (cursor, rectangle, circle, arrow, or scribble).
2. Click and drag on the whiteboard to create the selected shape.
3. To resize or move a shape, select the cursor tool and click on the shape. You can drag or resize the shape by its handles.
4. To delete a shape, select it with the cursor tool and press the `Backspace` key.
5. Use the color picker to change the fill color of the shape.
6. Click the download icon to save the whiteboard as a `.png` image.

## Future Improvements

- **Real-time Collaboration**: Add functionality for multiple users to interact with the canvas simultaneously using WebSockets or a backend.
- **Undo/Redo**: Implement undo and redo functionality.
- **Authentication**: Add authentication to save the user's whiteboard sessions.
