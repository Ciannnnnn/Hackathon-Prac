<?php

header("Content-Type: application/json");

$file = __DIR__ . "/data/users.json";

if (!file_exists($file)) {
    file_put_contents($file, "[]");
}

$users = json_decode(file_get_contents($file), true);

if (!is_array($users)) {
    $users = [];
}

$method = $_SERVER["REQUEST_METHOD"];
$action = $_GET["action"] ?? "";

function saveUsers($file, $users)
{
    file_put_contents(
        $file,
        json_encode($users, JSON_PRETTY_PRINT)
    );
}

if ($method === "GET" && $action === "users") {
    echo json_encode($users);
    exit;
}

if ($method === "GET" && $action === "stats") {

    $total = count($users);

    $active = count(
        array_filter(
            $users,
            fn($user) => $user["status"] === "Active"
        )
    );

    $inactive = count(
        array_filter(
            $users,
            fn($user) => $user["status"] === "Inactive"
        )
    );

    $admins = count(
        array_filter(
            $users,
            fn($user) => $user["role"] === "Administrator"
        )
    );

    echo json_encode([
        "total" => $total,
        "active" => $active,
        "inactive" => $inactive,
        "admins" => $admins
    ]);

    exit;
}

if ($method === "POST" && $action === "add") {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (
        empty($input["name"]) ||
        empty($input["email"]) ||
        empty($input["role"])
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);

        exit;
    }

    $ids = array_column($users, "id");

    $newId = empty($ids) ? 1 : max($ids) + 1;

    $newUser = [
        "id" => $newId,
        "name" => $input["name"],
        "email" => $input["email"],
        "role" => $input["role"],
        "status" => $input["status"] ?? "Active"
    ];

    $users[] = $newUser;

    saveUsers($file, $users);

    echo json_encode([
        "success" => true,
        "user" => $newUser
    ]);

    exit;
}

if ($method === "PUT" && $action === "update") {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id = intval($input["id"] ?? 0);

    foreach ($users as &$user) {

        if ($user["id"] === $id) {

            $user["name"] = $input["name"] ?? $user["name"];
            $user["email"] = $input["email"] ?? $user["email"];
            $user["role"] = $input["role"] ?? $user["role"];
            $user["status"] = $input["status"] ?? $user["status"];

            saveUsers($file, $users);

            echo json_encode([
                "success" => true,
                "user" => $user
            ]);

            exit;
        }
    }

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);

    exit;
}

if ($method === "DELETE" && $action === "delete") {

    $id = intval($_GET["id"] ?? 0);

    $found = false;

    foreach ($users as $key => $user) {

        if ($user["id"] === $id) {

            unset($users[$key]);

            $found = true;

            break;
        }
    }

    if (!$found) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }

    $users = array_values($users);

    saveUsers($file, $users);

    echo json_encode([
        "success" => true
    ]);

    exit;
}

http_response_code(404);

echo json_encode([
    "success" => false,
    "message" => "Invalid request"
]);